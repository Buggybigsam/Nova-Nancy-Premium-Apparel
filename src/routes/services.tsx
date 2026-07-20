import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppButton } from "@/components/whatsapp-button";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Nova Nancy Atelier" },
      { name: "description", content: "Bespoke tailoring, bridal, corporate, and heritage couture services from Nova Nancy." },
      { property: "og:title", content: "Nova Nancy Services" },
      { property: "og:description", content: "Explore our couture services — from bespoke bridal to corporate uniform programs." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("services").select("*").eq("is_active", true).order("created_at").then(({ data }) => setServices(data ?? []));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="border-b border-border bg-beige py-20">
        <div className="container mx-auto px-6 md:px-10">
          <span className="eyebrow">Services</span>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl md:text-6xl">
            Couture, tailored to<br /><span className="italic">every occasion.</span>
          </h1>
        </div>
      </section>
      <section className="container mx-auto grid grid-cols-1 gap-8 px-6 py-16 md:grid-cols-2 md:px-10 lg:grid-cols-3">
        {services.map((s) => (
          <div key={s.id} className="group border border-border bg-background p-8 transition-colors hover:border-accent">
            <div className="text-[10px] uppercase tracking-[0.25em] text-accent">{s.category}</div>
            <h3 className="mt-3 font-serif text-2xl">{s.title}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{s.description}</p>
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm">from <span className="font-serif text-xl">${s.base_price}</span></div>
              <Link to="/orders/new" className="text-[11px] uppercase tracking-[0.25em] text-accent hover:underline">Commission →</Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
