import { describe, it, expect } from "bun:test";
import { CONFIG } from "@/config";

describe("Bun API", () => {
    it("should have correct configuration", () => {
        expect(CONFIG.api.name).toBe("LavaGo API (Bun)");
        expect(CONFIG.api.version).toBe("1.0.0");
        expect(CONFIG.port).toBe("3000");
    });

    it("should support path aliases", () => {
        // This test verifies that @/config import works
        expect(CONFIG).toBeDefined();
        expect(typeof CONFIG.nodeEnv).toBe("string");
        expect(typeof CONFIG.baseUrl).toBe("string");
    });
}); 