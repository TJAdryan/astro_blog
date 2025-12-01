export const GET = async ({ params, request }) => {
    try {
        const response = await fetch('https://www.goodservice.io/api/routes/Q', {
            headers: {
                'User-Agent': 'AstroBlog/1.0',
            },
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ error: 'Failed to fetch data from upstream' }), {
                status: 502,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
};
