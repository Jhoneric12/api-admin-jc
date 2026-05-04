/// <reference types="node" />
import fs from "fs";
import path from "path";

// ==============================
// 📥 INPUT
// ==============================
const validLayers = ["controllers", "services", "repositories", "routes", "validations"] as const;
type Layer = (typeof validLayers)[number];
const defaultLayers: Layer[] = ["controllers", "services", "routes", "validations"];

const layerFlags: Record<Layer, string[]> = {
  controllers: ["--controllers", "--controller"],
  services: ["--services", "--service"],
  repositories: ["--repositories", "--repository"],
  routes: ["--routes", "--route"],
  validations: ["--validations", "--validation"],
};

const args = process.argv.slice(2);

const getFlagValue = (flag: string) => {
  const index = args.findIndex((arg) => arg === flag);
  if (index === -1) return undefined;
  const next = args[index + 1];
  if (!next || next.startsWith("--")) return undefined;
  return next;
};

const getInlineValue = (flag: string) => {
  const prefix = `${flag}=`;
  const found = args.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : undefined;
};

const nameArg = getInlineValue("--name") ?? getFlagValue("--name");
const dirArg = getInlineValue("--dir") ?? getFlagValue("--dir");

const positionalInput = args.find((arg) => !arg.startsWith("--"));
const pathInput = positionalInput ?? [dirArg, nameArg].filter(Boolean).join("/");

if (!pathInput) {
  console.error("❌ Provide module path (e.g. v1/user)");
  console.error("   You can also use: --name user --dir v1");
  console.error("   Optional layer flags: --controllers --services --repositories --routes --validations");
  process.exit(1);
}

const selectedLayers: Layer[] = validLayers.filter((layer) => layerFlags[layer].some((flag) => args.includes(flag)));
const layersToGenerate = selectedLayers.length > 0 ? selectedLayers : [...defaultLayers];

const parts = pathInput.split("/");
const rawName = parts.pop()!;
const folders = parts;

// ==============================
// 🧠 HELPERS
// ==============================
const camelCase = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);

const pascalCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const pluralize = (str: string) => str + "s";

const fileName = camelCase(rawName);
const className = pascalCase(rawName);
const pluralName = pluralize(className);

// base path → server/src
const basePath = path.join(process.cwd(), "server", "src");

// ensure directory exists
const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log("📁 Created:", dir);
  }
};

// build directory path
const buildDir = (layer: string) => path.join(basePath, layer, ...folders);

// dynamic import path resolver
const getImportPath = (from: string, to: string) => {
  let rel = path.relative(from, to).replace(/\\/g, "/");
  rel = rel.replace(/\.ts$/, "");
  if (!rel.startsWith(".")) rel = "./" + rel;
  return rel;
};

// create file safely
const createFile = (layer: string, filename: string, content: string) => {
  const dir = buildDir(layer);
  ensureDir(dir);

  const fullPath = path.join(dir, filename);

  if (fs.existsSync(fullPath)) {
    console.log("⚠️ Skipped (exists):", fullPath);
    return;
  }

  fs.writeFileSync(fullPath, content);
  console.log("✅ Created:", fullPath);
};

// ==============================
// 📍 PATHS (for imports)
// ==============================
const controllerDir = buildDir("controllers");
const serviceDir = buildDir("services");
const repoDir = buildDir("repositories");
const routeDir = buildDir("routes");
const validationDir = buildDir("validations");

const servicePath = path.join(serviceDir, `${fileName}.service.ts`);
const repoPath = path.join(repoDir, `${fileName}.repository.ts`);
const controllerPath = path.join(controllerDir, `${fileName}.controller.ts`);
const validationPath = path.join(validationDir, `${fileName}.validation.ts`);
const errorPath = path.join(basePath, "utils", "app-error.ts");

// imports
const controllerImport = getImportPath(routeDir, controllerPath);
const validationImport = getImportPath(routeDir, validationPath);
const errorImportValidation = getImportPath(validationDir, errorPath);
const shouldWireValidation = layersToGenerate.includes("validations") || fs.existsSync(validationPath);

// ==============================
// 🧩 TEMPLATES
// ==============================

// CONTROLLER
const controllerTemplate = `import type { Request, Response } from "express";
class ${className}Controller {
  get${pluralName} = async (_req: Request, res: Response) => {
    // TODO: Call service layer when needed.
    const data: unknown[] = [];
    res.status(200).json(data);
  };

  get${className}ById = async (req: Request, res: Response) => {
    // TODO: Call service layer when needed.
    const data = { id: req.params.id };
    res.status(200).json(data);
  };

  create${className} = async (req: Request, res: Response) => {
    // TODO: Call service layer when needed.
    const data = req.body;
    res.status(201).json(data);
  };

  update${className} = async (req: Request, res: Response) => {
    // TODO: Call service layer when needed.
    const data = { id: req.params.id, ...req.body };
    res.status(200).json(data);
  };

  delete${className} = async (_req: Request, res: Response) => {
    // TODO: Call service layer when needed.
    res.status(204).send();
  };
}

export const ${fileName}Controller = new ${className}Controller();
`;

// SERVICE
const serviceTemplate = `class ${className}Service {
  async getAll${pluralName}() {
    // TODO: Call repository layer when needed.
    return [];
  }

  async get${className}ById(id: string) {
    // TODO: Call repository layer when needed.
    return { id };
  }

  async create${className}(payload: any) {
    // TODO: Call repository layer when needed.
    return payload;
  }

  async update${className}(id: string, payload: any) {
    // TODO: Call repository layer when needed.
    return { id, ...payload };
  }

  async delete${className}(_id: string) {
    // TODO: Call repository layer when needed.
    return;
  }
}

export const ${fileName}Service = new ${className}Service();
`;

// REPOSITORY
const repositoryTemplate = `export interface ${className}Repository {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any | null>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<void>;
}

class ${className}RepositoryImpl implements ${className}Repository {
  async findAll(): Promise<any[]> {
    return [];
  }

  async findById(id: string): Promise<any | null> {
    void id;
    return null;
  }

  async create(data: any): Promise<any> {
    return data;
  }

  async update(id: string, data: any): Promise<any> {
    void id;
    return data;
  }

  async delete(id: string): Promise<void> {
    void id;
  }
}

export const ${fileName}Repository = new ${className}RepositoryImpl();
`;

// ROUTE
const routeImports = [
  `import { Router } from "express";`,
  `import { ${fileName}Controller } from "${controllerImport}";`,
  shouldWireValidation
    ? `import { create${className}Schema, update${className}Schema, validate${className}Payload } from "${validationImport}";`
    : "",
]
  .filter(Boolean)
  .join("\n");

const routeTemplate = `${routeImports}

const router = Router();

router.get("/", ${fileName}Controller.get${pluralName});
router.get("/:id", ${fileName}Controller.get${className}ById);
router.post("/", ${shouldWireValidation ? `validate${className}Payload(create${className}Schema), ` : ""}${fileName}Controller.create${className});
router.put("/:id", ${shouldWireValidation ? `validate${className}Payload(update${className}Schema), ` : ""}${fileName}Controller.update${className});
router.delete("/:id", ${fileName}Controller.delete${className});

export default router;
`;

// VALIDATION
const validationTemplate = `import type { NextFunction, Request, Response } from "express";
import { APIError } from "${errorImportValidation}";

interface ${className}Schema {
  required: string[];
}

export const create${className}Schema: ${className}Schema = {
  required: [],
};

export const update${className}Schema: ${className}Schema = {
  required: [],
};

export const validate${className}Payload = (schema: ${className}Schema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const missing = schema.required.filter((field) => req.body?.[field] == null);

    if (missing.length > 0) {
      next(new APIError("Missing required field(s): " + missing.join(", "), 400));
      return;
    }

    next();
  };
`;

// ==============================
// 🚀 GENERATE FILES
// ==============================

const layerGenerators: Record<Layer, () => void> = {
  controllers: () => createFile("controllers", `${fileName}.controller.ts`, controllerTemplate),
  services: () => createFile("services", `${fileName}.service.ts`, serviceTemplate),
  repositories: () => createFile("repositories", `${fileName}.repository.ts`, repositoryTemplate),
  routes: () => createFile("routes", `${fileName}.route.ts`, routeTemplate),
  validations: () => createFile("validations", `${fileName}.validation.ts`, validationTemplate),
};

for (const layer of layersToGenerate) {
  layerGenerators[layer]();
}
