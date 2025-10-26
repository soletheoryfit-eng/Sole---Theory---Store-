export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

const OWNER = process.env.GITHUB_OWNER!;
const REPO = process.env.GITHUB_REPO!;
const BRANCH = process.env.GITHUB_BRANCH || "main";
const TOKEN = process.env.GITHUB_TOKEN!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

const FILE_PATH = "data/products.json";

async function getFileSha() {
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: "application/vnd.github+json" },
    cache: "no-store"
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.sha as string;
}

async function readProducts(): Promise<any[]> {
  const url = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${FILE_PATH}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

async function writeProducts(updated: any[]) {
  const sha = await getFileSha();
  const content = Buffer.from(JSON.stringify(updated, null, 2)).toString("base64");

  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Update products",
      content,
      sha,
      branch: BRANCH
    })
  });

  if (!res.ok) throw new Error("GitHub write failed");
}

export async function GET() {
  const products = await readProducts();
  return NextResponse.json(products);
}

// Create
export async function POST(req: NextRequest) {
  const body = await req.json();
  if (body.password !== ADMIN_PASSWORD) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { image, name, description, priceRON } = body;
  if (!image || !name || !priceRON) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const products = await readProducts();
  const id = `st-${(products.length + 1).toString().padStart(3, "0")}`;
  const item = { id, image, name, description: description || "", priceRON: Number(priceRON), visible: true };

  await writeProducts([item, ...products]);
  return NextResponse.json({ ok: true, item });
}

// Edit
export async function PUT(req: NextRequest) {
  const body = await req.json();
  if (body.password !== ADMIN_PASSWORD) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, image, name, description, priceRON, visible } = body;
  const products = await readProducts();
  const idx = products.findIndex((p: any) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  products[idx] = {
    ...products[idx],
    image: image ?? products[idx].image,
    name: name ?? products[idx].name,
    description: description ?? products[idx].description,
    priceRON: priceRON !== undefined ? Number(priceRON) : products[idx].priceRON,
    visible: visible !== undefined ? !!visible : products[idx].visible
  };

  await writeProducts(products);
  return NextResponse.json({ ok: true, item: products[idx] });
}

// Delete
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  if (body.password !== ADMIN_PASSWORD) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = body;
  const products = await readProducts();
  const filtered = products.filter((p: any) => p.id !== id);
  await writeProducts(filtered);
  return NextResponse.json({ ok: true });
}
