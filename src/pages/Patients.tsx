import { useState } from "react";
import Layout from "@/components/Layout";
import { getPatients, savePatient, deletePatient, generateId, getReportsByPatient } from "@/lib/store";
import { Patient } from "@/lib/data";
import { toast } from "@/hooks/use-toast";
import { Trash2, Plus, Search } from "lucide-react";

export default function Patients() {
  const [patients, setPatients] = useState(getPatients());
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", gender: "Male" as const, phone: "", address: "" });

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  );

  function handleAdd() {
    if (!form.name || !form.age || !form.phone) {
      toast({ title: "Fill required fields", variant: "destructive" });
      return;
    }
    const p: Patient = {
      id: generateId(),
      name: form.name,
      age: Number(form.age),
      gender: form.gender,
      phone: form.phone,
      address: form.address,
      createdAt: new Date().toISOString(),
    };
    savePatient(p);
    setPatients(getPatients());
    setForm({ name: "", age: "", gender: "Male", phone: "", address: "" });
    setShowAdd(false);
    toast({ title: "Patient added!" });
  }

  function handleDelete(id: string) {
    deletePatient(id);
    setPatients(getPatients());
    toast({ title: "Patient deleted" });
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="font-heading text-2xl font-bold text-foreground">Patients</h1>
          <button className="neo-btn px-4 py-2 text-sm font-semibold text-primary flex items-center gap-2" onClick={() => setShowAdd(!showAdd)}>
            <Plus size={16} /> Add Patient
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            className="neo-input w-full pl-10 pr-4 py-3 text-sm text-foreground"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Add form */}
        {showAdd && (
          <div className="neo-flat p-6 space-y-4">
            <h2 className="font-heading font-semibold text-foreground text-sm">New Patient</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input className="neo-input px-4 py-3 text-sm text-foreground" placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="neo-input px-4 py-3 text-sm text-foreground" placeholder="Age *" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
              <select className="neo-input px-4 py-3 text-sm text-foreground" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as any })}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input className="neo-input px-4 py-3 text-sm text-foreground" placeholder="Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className="neo-input px-4 py-3 text-sm text-foreground col-span-full" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <button className="neo-btn px-6 py-3 text-sm font-semibold text-primary" onClick={handleAdd}>
              Save Patient
            </button>
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="neo-concave p-8 text-center text-muted-foreground text-sm">
              No patients found
            </div>
          ) : (
            filtered.map((p) => {
              const reportCount = getReportsByPatient(p.id).length;
              return (
                <div key={p.id} className="neo-flat p-4 flex items-center gap-4">
                  <div className="neo-concave w-12 h-12 flex items-center justify-center shrink-0">
                    <span className="font-heading font-bold text-primary text-lg">{p.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.age}y, {p.gender} • {p.phone}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{reportCount} report(s)</p>
                  </div>
                  <button className="neo-btn p-2 text-destructive" onClick={() => handleDelete(p.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}
