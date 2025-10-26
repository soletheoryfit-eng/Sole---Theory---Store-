import Image from "next/image";
import { ron, waOrderLink } from "@/components/ui";

async function getProducts() {
  // Read from your repo raw file so changes appear without redeploy.
  const owner = process.env.GITHUB_OWNER || "<YOUR_GITHUB_USERNAME>";
  const repo = process.env.GITHUB_REPO || "soletheory";
  const branch = process.env.GITHUB_BRANCH || "main";
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/data/products.json`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) { return []; }
  return res.json();
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div>
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-14">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Elevate Every Step.</h1>
            <p className="mt-3 text-neutral-600">
              Authentic-quality sneakers shipped from our verified suppliers in the U.S. and China.
              Orders in Romania. Prices in RON. Payment after confirmation.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <Image src="/images/aeroflex-black.jpg" alt="SoleTheory" width={1200} height={900} className="w-full h-auto" />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-extrabold mb-4">Featured</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.filter((p: any) => p.visible).map((p: any) => (
            <div key={p.id} className="rounded-3xl border bg-white overflow-hidden hover:shadow-xl transition">
              <div className="aspect-[4/3] relative">
                <Image src={p.image} alt={p.name} fill className="object-cover" />
              </div>
              <div className="p-4">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-neutral-600 line-clamp-2">{p.description}</div>
                <div className="mt-2 font-semibold">{ron(p.priceRON)}</div>
                <a href={waOrderLink(p.name, p.priceRON)} className="mt-3 inline-flex px-4 py-2 text-sm rounded-2xl bg-black text-white">
                  Order on WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
