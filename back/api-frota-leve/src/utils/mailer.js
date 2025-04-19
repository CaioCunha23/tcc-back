import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInfractionNotification(data) {
    const {
        to,
        colaboradorNome,
        infractionDate,
        infractionType,
        recognitionLink
    } = data;

    const dateObj = infractionDate instanceof Date
        ? infractionDate
        : new Date(infractionDate);

    try {
        const response = await resend.emails.send({
            from: "caiocunha08@gmail.com",
            to,
            subject: "Nova infração registrada em seu nome",
            html: `
        <p>Olá ${colaboradorNome},</p>
        <p>Uma nova infração (<strong>${infractionType}</strong>) 
          foi registrada para você em ${dateObj.toLocaleDateString()}.
        </p>
        <p>Por favor, acesse o link abaixo para reconhecer ou contestar:</p>
        <p><a href="${recognitionLink}">Reconhecer/Contestar Infração</a></p>
        <p>Obrigado!</p>
      `,
        });

        console.log("E‑mail enviado com sucesso:", response.id);
        return response;
    } catch (err) {
        console.error("Falha no envio de e‑mail:", err);
        throw err;
    }
}