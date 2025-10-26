"use client";

import { useEffect, useState } from "react";

type Product = { id: string; image: string; name: string; description: string; priceRON: number; visible: boolean };

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDesc] = useState("");
  const [priceRON, setPrice] = useState<number | string>("");

  const [list, setList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const res = await fetch("/api/admin/products", { cache: "no-store" });
    const data = await res.json();
    setList(data);
  };

  useEffect(() => { load(); }, []);

  const login = () => {
    if (password.trim().length === 0) return;
    setAuthed(true);
  };

  const addProduct = async () => {
    setLoading(true); setMsg("");
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, image, name, description, priceRON })
    });
    const data = await res.json();
    if (res.ok) {
      setMsg("Added ✅");
      setImage(""); setName(""); setDesc(""); setPrice("");
      load();
    } else setMsg(data.error || "Error");
    setLoading(false);
  };

  const saveProduct = async (p: Product) => {
    setLoading(true); setMsg("");
    const res = await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, ...p })
    });
    if (res.ok) { setMsg("Saved ✅"); load(); } else { const d = await res.json(); setMsg(d.error || "Error"); }
    setLoading(false);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete?")) return;
    setLoading(true); setMsg("");
    const res = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, id })
    });
    if (res.ok) { setMsg("Deleted ✅"); load(); } else { const d = await res.json(); setMsg(d.error || "Error"); }
    setLoading(false);
  };

  if (!authed) {
    return (
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-xl font-bold mb-3">Admin Login</h1>
        <input className="w-full border rounded-xl px-3 py-2" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={login} className="mt-3 px-4 py-2 rounded-2xl bg-black text-white">Enter</button>
        <p className="text-xs text-neutral-500 mt-2">Use the password you shared.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Admin — Add Product</h1>
      <div className="grid md:grid-cols-3 gap-3 mt-4">
        <input className="border rounded-xl px-3 py-2" placeholder="Image URL (or /images/xxx.jpg)" value={image} onChange={e => setImage(e.target.value)} />
        <textarea className="border rounded-xl px-3 py-2" placeholder="Name + Description" value={name + (description ? `\n${description}` : "")}
          onChange={e => {
            const lines = e.target.value.split("\n");
            setName(lines[0] || "");
            setDesc(lines.slice(1).join("\n"));
          }} />
        <input className="border rounded-xl px-3 py-2" placeholder="Price (RON)" value={priceRON} onChange={e => setPrice(e.target.value)} />
      </div>
      <button disabled={loading} onClick={addProduct} className="mt-3 px-4 py-2 rounded-2xl bg-black text-white">{loading ? "Saving..." : "Add product"}</button>
      {msg && <div className="mt-2 text-sm">{msg}</div>}

      <h2 className="text-xl font-bold mt-8">All Products</h2>
      <div className="mt-3 grid gap-3">
        {list.map(p => (
          <div key={p.id} className="border rounded-2xl p-3 bg-white">
            <div className="text-xs text-neutral-500">{p.id}</div>
            <div className="grid md:grid-cols-5 gap-2 mt-2">
              <input className="border rounded-xl px-2 py-1 md:col-span-2" value={p.image} onChange={e => setList(ls => ls.map(x => x.id===p.id ? {...x, image: e.target.value} : x))} />
              <input className="border rounded-xl px-2 py-1" value={p.name} onChange={e => setList(ls => ls.map(x => x.id===p.id ? {...x, name: e.target.value} : x))} />
              <input className="border rounded-xl px-2 py-1" value={p.description} onChange={e => setList(ls => ls.map(x => x.id===p.id ? {...x, description: e.target.value} : x))} />
              <input className="border rounded-xl px-2 py-1" value={p.priceRON} onChange={e => setList(ls => ls.map(x => x.id===p.id ? {...x, priceRON: Number(e.target.value) || 0} : x))} />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <label className="text-sm flex items-center gap-1">
                <input type="checkbox" checked={p.visible} onChange={e => setList(ls => ls.map(x => x.id===p.id ? {...x, visible: e.target.checked} : x))} />
                Visible
              </label>
              <button onClick={() => saveProduct(p)} className="px-3 py-1 rounded-xl bg-black text-white text-sm">Save</button>
              <button onClick={() => deleteProduct(p.id)} className="px-3 py-1 rounded-xl border text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
