import React, { useMemo, useState, useEffect } from "react";
import { Search, Play, Users, CloudLightning, BookOpen, Sparkles, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog";

// ------------------------------------------------------------
//  BITÁCORA RAMO DEPORTIVO – SPA ESTÁTICA CON REACT + TAILWIND
// ------------------------------------------------------------
//  ✏️ Cómo editar los contenidos:
//  1) Busca más abajo las constantes `APLAUSOS_DATA`, `DINAMICAS_DATA` y `JUEGOS_DATA`.
//  2) Cada actividad tiene: id, title, description, tags (array), videoUrl (opcional).
//  3) Agrega o edita elementos. Para YouTube, pega la URL normal (ej. https://youtu.be/..).
//  4) Guarda y listo. Para publicar, mira "INSTRUCCIONES DE PUBLICACIÓN" al final.
// ------------------------------------------------------------

// Utilidad: convierte URL de YouTube a URL embebible

const TAGS_ALLOWED = ["individual", "parejas", "grupal"];

function sanitizeTags(tags = []) {
  return tags
    .map((t) => (t || "").toLowerCase().trim())
    .filter((t) => TAGS_ALLOWED.includes(t));
}

function tagClass(t) {
  const k = (t || "").toLowerCase();
  if (k === "individual") return "bg-blue-100 text-blue-800";
  if (k === "parejas") return "bg-amber-100 text-amber-800";
  if (k === "grupal") return "bg-emerald-100 text-emerald-800";
  return "bg-slate-100 text-slate-800";
}

function toYoutubeEmbed(url) {
  try {
    if (!url) return null;
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

function ClapEmojiIcon({ className = "h-5 w-5" }) {
  return <span className={className} aria-hidden>👏</span>;
} 

function SparklesEmoji({ className = "h-5 w-5" }) {
  return <span className={className} aria-hidden>✨</span>;
} 

function GamesEmoji({ className = "h-5 w-5" }) {
  return <span className={className} aria-hidden>🏃‍♂️‍➡️</span>;
} 



function VideoPlayer({ url }) {
  if (!url) return null;
  const yt = toYoutubeEmbed(url);
  if (yt) {
    return (
      <div className="w-full aspect-video rounded-xl overflow-hidden shadow-sm">
        <iframe className="w-full h-full" src={yt} title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
    );
  }
  const isMP4 = url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg");
  if (isMP4) {
    return (
      <video className="w-full rounded-xl" controls>
        <source src={url} />
        Tu navegador no soporta video embebido.
      </video>
    );
  }
  return null;
}

// ----------------------------
//  DATOS (EDITA AQUÍ)
// ----------------------------

const APLAUSO_LLUVIA_DESC = `El objetivo de este aplauso individual es representar, a través de sonidos con las manos, las distintas intensidades de la lluvia. Cada persona lo realiza de manera independiente, comenzando con un dedo que golpea suavemente la palma, lo que simboliza la garuga o llovizna ligera. Luego se continúa con dos dedos, que representan una lluvia suave, para después pasar a tres dedos que evocan una lluvia moderada. Al sumar cuatro dedos, el sonido se intensifica y se asemeja a una lluvia fuerte, hasta llegar finalmente al aplauso completo con toda la palma, que representa la tormenta. Tras alcanzar este punto máximo, el aplauso se desarrolla en sentido inverso: de la tormenta se retrocede a la lluvia fuerte, luego a la moderada, después a la suave y finalmente a la garuga, reflejando cómo la lluvia disminuye poco a poco hasta desaparecer.`;

// Generador de placeholders legibles
const makePlaceholders = (prefix, count, tag = "individual") =>
  Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    title: `${prefix[0].toUpperCase() + prefix.slice(1)} ${i + 1}`,
    description: "Completar con explicación de la actividad (objetivo, pasos y cierre).",
    tags: [tag],
    videoUrl: "",
  }));

const APLAUSOS_DATA = [
  {
    id: "ap-lluvia",
    title: "Aplauso de la Lluvia",
    description: APLAUSO_LLUVIA_DESC,
    tags: ["individual"],
    videoUrl: "", // opcional: pega aquí un enlace a YouTube o a un MP4
  },
  ...makePlaceholders("Aplauso", 49),
];

const DINAMICAS_DATA = [
  ...makePlaceholders("Dinámica", 50, "grupo"),
];

const JUEGOS_DATA = [
  ...makePlaceholders("Juego", 50, "lúdico"),
];

// ----------------------------
//  COMPONENTES DE UI
// ----------------------------

function NavBar({ current, onChange }) {
  const items = [
    { key: "aplausos", label: "Aplausos", icon: <ClapEmojiIcon className="h-5 w-5" /> },
    { key: "dinamicas", label: "Dinámicas", icon: <SparklesEmoji className="h-5 w-5" /> },
    { key: "juegos", label: "Juegos", icon: <GamesEmoji className="h-5 w-5" /> },
    { key: "nosotros", label: "Nosotros", icon: <Users className="h-5 w-5" /> },
  ];
  return (
    <div className="sticky top-0 z-30 backdrop-blur bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2">
        <div
          className="flex items-center gap-2 font-semibold text-lg cursor-pointer select-none hover:opacity-90 transition"
          onClick={() => onChange('landing')}
          title="Volver a la portada"
        >
          <BookOpen className="h-6 w-6" />
          <span>Bitácora Ramo Deportivo</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {items.map((it) => (
            <Button
              key={it.key}
              variant={current === it.key ? "default" : "ghost"}
              className={`rounded-full ${current === it.key ? "shadow" : ""}`}
              onClick={() => onChange(it.key)}
            >
              <div className="flex items-center gap-2">
                {it.icon}
                <span className="hidden sm:inline">{it.label}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ item, onOpen, onTagClick }) {
  return (
    <Card className="hover:shadow-lg border border-blue-100 transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-base line-clamp-1">{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-600 line-clamp-3 mb-3">{item.description}</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {sanitizeTags(item.tags).map((t) => (
              <button
                key={t}
                type="button"
                className={`h-7 px-3 rounded-full border border-transparent text-xs transition ${tagClass(t)}`}
                onClick={(e) => {
                  e.stopPropagation();   // no abre el modal
                  onTagClick?.(t);       // filtra por el tag
                }}
                title={`Filtrar por: ${t}`}
              >
                {t}
              </button>
            ))}
          </div>
        <Button onClick={() => onOpen(item)} className="w-full">
          Ver detalle <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function ActivityGrid({ data, label }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((d) =>
      [d.title, ...sanitizeTags(d.tags)].some((x) => x?.toLowerCase().includes(q))
    );
  }, [data, query]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <h2 className="text-2xl font-semibold mr-auto">{label}</h2>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            className="pl-9"
            placeholder={`Buscar ${label.toLowerCase()}…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <ActivityCard key={item.id} item={item} onOpen={setSelected} onTagClick={setQuery} />
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="w-[min(92vw,720px)]">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="prose prose-neutral max-w-none">
                  <p className="whitespace-pre-line">{selected.description}</p>
                </div>
                {selected.videoUrl ? (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2"><Play className="h-4 w-4"/>Demostración</h4>
                    <VideoPlayer url={selected.videoUrl} />
                  </div>
                ) : null}
                {selected.tags?.length ? (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {sanitizeTags(selected.tags).map((t) => (
                      <Badge key={t} variant="secondary" className={`rounded-full ${tagClass(t)}`}>{t}</Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Nosotros() {
  const integrantes = [
    {
      name: "Angel Concha",
      carrera: "Ingeniería Civil Industrial TI",
      fotoUrl: "/nosotros/angel.jpg",
    },
    {
      name: "Catalina Diez",
      carrera: "Ingeniería Civil Industrial TI",
      fotoUrl: "/nosotros/catalina.jpg",
    },
    {
      name: "Amparo Frugone",
      carrera: "?",
      fotoUrl: "/nosotros/amparo.jpg",
    },
    {
      name: "Antonia Marín",
      carrera: "Ingeniería Civil IDI",
      fotoUrl: "/nosotros/antonia.jpg",
    },
    {
      name: "Sebastián Musé",
      carrera: "Ingeniería Civil Industrial TI",
      fotoUrl: "/nosotros/sebastian.jpg",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-semibold mb-6">Nosotros</h2>

      {/* 🔹 Mantengo el subtítulo tal cual lo solicitaste */}
      <p className="text-neutral-700 mb-6">
        Esta bitácora recopila 50 aplausos, 50 dinámicas y 50 juegos del ramo. Fue diseñada para ser
        clara, rápida y pública: cualquier persona con el enlace puede ver el contenido.
      </p>

      {/* Grid responsiva para 5 integrantes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {integrantes.map((p) => (
          <Card key={p.name} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-slate-800">{p.name}</CardTitle>
            </CardHeader>

            <CardContent>
              {/* 📷 Foto bajo el nombre */}
              <div className="mb-3">
                <img
                  src={p.fotoUrl}
                  alt={`Foto de ${p.name}`}
                  className="w-full h-48 object-cover rounded-xl border border-slate-200 bg-slate-100"
                />
              </div>

              {/* 🎓 Carrera universitaria */}
              <p className="text-sm text-neutral-700">
                <span className="font-medium">Carrera: </span>
                {p.carrera}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ----------------------------
//  APP PRINCIPAL
// ----------------------------

function LandingPage({ onEnter }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-200 via-sky-50 to-indigo-200 text-slate-800 px-4">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-blue-700 drop-shadow-sm">
        Liderazgo, Juegos y Recreación I
      </h1>
      <p className="text-xl md:text-2xl mb-2 text-slate-700">2025-2</p>
      <p className="text-lg md:text-xl mb-8 text-slate-600">Grupo: El mejor 😎</p>
      <Button
        onClick={onEnter}
        className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-2xl shadow-lg transition-transform hover:scale-105"
      >
        Entrar a la Bitácora
      </Button>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(() => localStorage.getItem("route") || "aplausos");
  useEffect(() => {
    localStorage.setItem("route", route);
  }, [route]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-indigo-50">
      {route === "landing" ? (
        <LandingPage onEnter={() => setRoute("aplausos")} />
      ) : (
        <>
          <NavBar current={route} onChange={setRoute} />
          {route === "aplausos" && <ActivityGrid data={APLAUSOS_DATA} label="Aplausos" />}
          {route === "dinamicas" && <ActivityGrid data={DINAMICAS_DATA} label="Dinámicas" />}
          {route === "juegos" && <ActivityGrid data={JUEGOS_DATA} label="Juegos" />}
          {route === "nosotros" && <Nosotros />}
          <footer className="border-t border-neutral-200 mt-8">
            <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-neutral-600">

            </div>
          </footer>
        </>
      )}
    </div>
  );
}
