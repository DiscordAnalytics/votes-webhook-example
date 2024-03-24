import { unstable_dev } from 'wrangler';
import { describe, expect, it, beforeAll, afterAll } from 'vitest';

describe('Worker', () => {
	let worker;

	beforeAll(async () => {
		worker = await unstable_dev('index.js', {}, { disableExperimentalWarning: true });
	});

	afterAll(async () => {
		await worker.stop();
	});

	it('Should retun a simple message', async () => {
		const resp = await worker.fetch('/');
		if (resp) {
			const text = await resp.text();
			expect(text).toMatchInlineSnapshot(
				`"App is live!"`
			);
		}
	});

	it('should return status 400', async () => {
		const resp = await worker.fetch('/webhook', {
            method: "POST",
            body: "{}"
        });
		if (resp) {
			const text = await resp.text();
			expect(text).toBe('Invalid body');
			expect(resp.status).toBe(400);
		}
	});

	it('should return 401 reponse', async () => {
		const resp = await worker.fetch('/webhook', {
			body: JSON.stringify({ botId: "botId", voterId: "voterId", provider: "wrangler-tests", date: "2024-03-24T08:58:00.755Z" }),
			method: 'POST',
		});
		if (resp) {
            const txt = await resp.text();
			expect(txt).toBe("Unauthorized");
			expect(resp.status).toBe(401);
		}
	});

	it('should return 404 for undefined routes', async () => {
		const resp = await worker.fetch('/foobar');
		if (resp) {
            const txt = await resp.text()
            expect(txt).toBe("Not found")
			expect(resp.status).toBe(404);
		}
	});
});
