import * as t from "jsr:@lukeed/tschema";
import { Type } from "npm:@sinclair/typebox";
import { zodToJsonSchema } from "npm:zod-to-json-schema";
import { z } from "npm:zod";
import * as v from "npm:valibot";
import { Ajv } from "npm:ajv";
import { Validator } from "npm:jsonschema";
import joi from "npm:joi";
import yup from "npm:yup";

const input = {
  uid: 64298,
  name: "lukeed",
  isActive: true,
  avatar: "https://example.com/lukeed.png",
  achievements: "pro",
  interests: ["painting", "playing games"],
  last_updated: 1722642982,
};

Deno.bench("tschema", { group: "builder" }, () => {
  let _ = t.object({
    uid: t.integer(),
    name: t.string({
      description: "full name",
      examples: ["Alex Johnson"],
    }),
    isActive: t.boolean(),
    avatar: t.optional(
      t.string({ format: "uri" }),
    ),
    achievements: t.tuple([
      t.number({ minimum: 0 }), // points
      t.enum(["novice", "pro", "expert", "master"]),
    ]),
    interests: t.array(
      t.string({
        minLength: 4,
        maxLength: 36,
      }),
    ),
    last_updated: t.integer({
      minimum: 0,
      examples: [1722642982],
      description: "unix seconds",
    }),
  });
});

Deno.bench("sinclair/typebox", { group: "builder" }, () => {
  let _ = Type.Object({
    uid: Type.Integer(),
    name: Type.String({
      description: "full name",
      examples: ["Alex Johnson"],
    }),
    isActive: Type.Boolean(),
    avatar: Type.Optional(
      Type.String({ format: "uri" }),
    ),
    achievements: Type.Tuple([
      Type.Number({ minimum: 0 }), // points
      // NOTE: different
      // Type.Enum({
      // 	NOVICE: 'novice',
      // 	PRO: 'pro',
      // 	EXPERT: 'expert',
      // 	MASTER: 'master',
      // }),

      // NOTE: equivalent output
      Type.Unsafe<string>({
        enum: ["novice", "pro", "expert", "master"],
      }),
    ]),
    interests: Type.Array(
      Type.String({
        minLength: 4,
        maxLength: 36,
      }),
    ),
    last_updated: Type.Integer({
      minimum: 0,
      examples: [1722642982],
      description: "unix seconds",
    }),
  });
});

Deno.bench("zod-to-json-schema", { group: "builder" }, () => {
  let zod = z.object({
    uid: z.number().int(),
    name: z.string({
      description: "full name",
    }),
    isActive: z.boolean(),
    avatar: z.optional(
      z.string().url(),
    ),
    achievements: z.tuple([
      z.number().min(0), // points
      z.enum(["novice", "pro", "expert", "master"]),
    ]),
    interests: z.array(
      z.string().min(4).max(36),
    ),
    last_updated: z.number({
      description: "unix seconds",
    }).int().min(0),
  });

  let _ = zodToJsonSchema(zod);
});

Deno.bench("valibot", { group: "builder" }, () => {
  let _ = v.object({
    uid: v.pipe(v.number(), v.integer()),
    name: v.string("full name"),
    isActive: v.boolean(),
    avatar: v.optional(
      v.pipe(v.string(), v.url()),
    ),
    achievements: v.tuple([
      v.pipe(v.number(), v.minValue(0)), // points
      v.picklist(["novice", "pro", "expert", "master"] as const),
    ]),
    interests: v.array(
      v.pipe(v.string(), v.minLength(4), v.maxLength(36)),
    ),
    last_updated: v.pipe(v.number("unix seconds"), v.integer(), v.minValue(0)),
  });
});

Deno.bench("ajv", { group: "builder" }, () => {
  let _ = new Ajv({ formats: { uri: true } }).compile({
    type: "object",
    properties: {
      uid: { type: "integer" },
      name: {
        type: "string",
        description: "full name",
        examples: ["Alex Johnson"],
      },
      isActive: { type: "boolean" },
      avatar: { type: "string", format: "uri" },
      achievements: {
        anyOf: [
          { type: "string", enum: ["novice", "pro", "expert", "master"] },
          {
            type: "number",
            minimum: 0,
          },
        ],
      },
      interests: {
        type: "array",
        items: { type: "string", minLength: 4, maxLength: 36 },
      },
      last_updated: {
        type: "integer",
        minimum: 0,
        examples: [1722642982],
        description: "unix seconds",
      },
    },
  });
});

Deno.bench("jsonschema", { group: "builder" }, () => {
  let _ = new Validator().validate(input, {
    type: "object",
    properties: {
      uid: { type: "integer" },
      name: {
        type: "string",
        description: "full name",
      },
      isActive: { type: "boolean" },
      avatar: { type: "string", format: "uri" },
      achievements: {
        anyOf: [
          { type: "string", enum: ["novice", "pro", "expert", "master"] },
          {
            type: "number",
            minimum: 0,
          },
        ],
      },
      interests: {
        type: "array",
        items: { type: "string", minLength: 4, maxLength: 36 },
      },
      last_updated: {
        type: "integer",
        minimum: 0,
        description: "unix seconds",
      },
    },
  });
});

Deno.bench("joi", { group: "builder" }, () => {
  let _ = joi.object({
    uid: joi.number().integer(),
    name: joi.string().description("full name").example("Alex Johnson"),
    isActive: joi.boolean(),
    avatar: joi.string().uri().optional(),
    achievements: joi.alternatives().try(
      joi.string().valid("novice", "pro", "expert", "master"),
      joi.number().min(0),
    ),
    interests: joi.array().items(joi.string().min(4).max(32).alphanum()),
    last_updated: joi.number().integer().min(0).description("unix seconds"),
  }).validate(input);
});

Deno.bench("yup", { group: "builder" }, () => {
  let _ = yup.object({
    uid: yup.number().integer(),
    name: yup.string(),
    isActive: yup.boolean(),
    avatar: yup.string().url().optional(),
    achievements: yup.mixed().oneOf([
      "novice",
      "pro",
      "expert",
      "master",
      yup.number().min(0),
    ]),
    interests: yup.array(yup.string().min(4).max(32)),
    last_updated: yup.number().integer().min(0),
  }).validate(input);
});
