import { Context } from "koa";
import { analyzeImage } from "../services/gemini";

export default {
  async analyze(ctx: Context) {
    try {
      
      const files = ctx.request.files as any;

      if (!files || !files.image) {
        return ctx.badRequest("No image uploaded");
      }

      const file = files.image;
      const filePath = file.filepath;

      if (!filePath) {
        return ctx.badRequest("File path missing");
      }

      
      const result = await analyzeImage(filePath);

      return ctx.send({
        success: true,
        result,
      });
    } catch (error: any) {
      console.error("IMAGE ANALYSIS ERROR:", error);

      return ctx.internalServerError("Analysis failed", {
        error: error.message,
      });
    }
  },
};