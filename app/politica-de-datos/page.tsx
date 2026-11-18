import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL_NAME, NIT, ADDRESS_LINE, PHONE_DISPLAY, TEL_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Tratamiento de Datos Personales",
  description: `Política de tratamiento de datos personales de ${LEGAL_NAME} conforme a la Ley 1581 de 2012.`,
  alternates: { canonical: "/politica-de-datos" },
};

/* TODO(CLIENTE): validar este texto con el área jurídica del colegio,
   agregar el correo oficial para consultas y la fecha de entrada en vigencia. */
export default function PoliticaDatos() {
  return (
    <main id="contenido" className="bg-paper">
      <div className="bg-ink text-white">
        <div className="wrap py-6">
          <Link href="/" className="link inline-flex min-h-11 items-center font-semibold text-white/85">← Volver al inicio</Link>
        </div>
      </div>
      <article className="wrap max-w-3xl py-16 text-[1.02rem] leading-relaxed text-ink [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-bold [&_li]:mt-2 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
        <p className="eyebrow text-navy">Ley 1581 de 2012 · Decreto 1377 de 2013</p>
        <h1 className="h-section mt-5">Política de Tratamiento de Datos Personales</h1>

        <h2>1. Responsable del tratamiento</h2>
        <p>
          {LEGAL_NAME}, NIT {NIT}, con domicilio en {ADDRESS_LINE}, Colombia. Teléfono:{" "}
          <a href={TEL_HREF} className="font-semibold text-navy underline">{PHONE_DISPLAY}</a>.
        </p>

        <h2>2. Datos que recolectamos</h2>
        <p>
          Nombre, número de teléfono y la información que las familias nos comparten voluntariamente
          en los formularios del sitio y en nuestros canales de atención, con el fin de responder
          solicitudes de información y de admisión.
        </p>

        <h2>3. Finalidades</h2>
        <ul>
          <li>Responder solicitudes de información sobre el colegio y el proceso de admisión.</li>
          <li>Agendar visitas y hacer seguimiento a las solicitudes de inscripción.</li>
          <li>Enviar información institucional relacionada con la solicitud del titular.</li>
        </ul>

        <h2>4. Datos de niñas, niños y adolescentes</h2>
        <p>
          El tratamiento de datos de menores de edad se hace respetando su interés superior y sus
          derechos fundamentales, y siempre con la autorización de su representante legal.
        </p>

        <h2>5. Derechos del titular</h2>
        <ul>
          <li>Conocer, actualizar y rectificar sus datos personales.</li>
          <li>Solicitar prueba de la autorización otorgada.</li>
          <li>Ser informado sobre el uso que se ha dado a sus datos.</li>
          <li>Revocar la autorización o solicitar la supresión de sus datos cuando proceda.</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio.</li>
          <li>Acceder de forma gratuita a sus datos personales.</li>
        </ul>

        <h2>6. Consultas y reclamos</h2>
        <p>
          Las consultas se atenderán en un plazo máximo de diez (10) días hábiles y los reclamos en
          un plazo máximo de quince (15) días hábiles, contados desde su recibo, a través del teléfono{" "}
          {PHONE_DISPLAY} o en la sede del colegio.
        </p>

        <h2>7. Vigencia</h2>
        <p>
          Esta política rige desde su publicación. Los datos se conservarán durante el tiempo necesario
          para cumplir las finalidades descritas.
        </p>
      </article>
    </main>
  );
}
