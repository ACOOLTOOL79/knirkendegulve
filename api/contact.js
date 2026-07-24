const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { name, phone, email, address, postalCode, city, description } = req.body || {};

    if (!name || !phone || !email || !description) {
        res.status(400).json({ error: 'Udfyld venligst alle påkrævede felter.' });
        return;
    }

    try {
        await resend.emails.send({
            from: 'KnirkendeGulve.dk <noreply@knirkendegulve.dk>',
            to: ['jonathanhansen45@gmail.com', 'knirkeriet@gmail.com'],
            reply_to: email,
            subject: `Ny henvendelse fra ${name}`,
            text: [
                `Navn: ${name}`,
                `Telefon: ${phone}`,
                `E-mail: ${email}`,
                `Adresse: ${address || '-'}`,
                `Postnummer: ${postalCode || '-'}`,
                `By: ${city || '-'}`,
                '',
                'Beskrivelse:',
                description,
            ].join('\n'),
        });

        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Resend error:', err);
        res.status(500).json({ error: 'Der skete en fejl. Prøv igen senere.' });
    }
};
