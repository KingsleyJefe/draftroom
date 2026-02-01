/// <reference types="node" />

import fs from "fs";
import path from "path";

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const pluralize = (str: string) => (str.endsWith("s") ? str : `${str}s`);

const entityArg = process.argv[2];

if (!entityArg) {
  console.error("❌ Please provide an entity name");
  console.error("Example: npm run make:entity user");
  process.exit(1);
}

const entityName = entityArg.toLowerCase();
const EntityName = capitalize(entityName);
const EntitiesName = capitalize(pluralize(entityName));

const rootDir = process.cwd();
const entitiesDir = path.join(rootDir, "src", "Entities");
const entityDir = path.join(entitiesDir, EntitiesName);

if (fs.existsSync(entityDir)) {
  console.error(`❌ Entity "${EntitiesName}" already exists`);
  process.exit(1);
}

const routesTemplate = `import { Router } from "express";
import verifyToken from "../../global/middlewares/verify-access-token";

const router = Router();

router.get("/", verifyToken);

export default router;
`;

const serviceTemplate = `const ${EntityName}Service = {
  create${EntityName}: async function () {
    return true;
  },
};

export default ${EntityName}Service;
`;

const controllerTemplate = `import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../global/constants/http-status-codes";

export const get${EntityName} = async (
  req: Request<object, object, object>,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "${entityName} fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};
`;

const dtoTemplate = `// ${EntityName} DTOs go here
`;

fs.mkdirSync(entityDir, { recursive: true });

fs.writeFileSync(path.join(entityDir, "routes.ts"), routesTemplate);
fs.writeFileSync(path.join(entityDir, "service.ts"), serviceTemplate);
fs.writeFileSync(path.join(entityDir, "controller.ts"), controllerTemplate);
fs.writeFileSync(path.join(entityDir, "dto.ts"), dtoTemplate);

const routesFilePath = path.join(rootDir, "src", "Routes.ts");

if (fs.existsSync(routesFilePath)) {
  let routesFile = fs.readFileSync(routesFilePath, "utf-8");

  const routeVarName = `${EntityName}Routes`;
  const routePath = pluralize(entityName);

  const importLine = `import ${routeVarName} from "./Entities/${EntitiesName}/routes";`;
  const useLine = `router.use("/${routePath}", ${routeVarName});`;

  if (!routesFile.includes(importLine)) {
    const lastImportIndex = routesFile.lastIndexOf("import");
    const insertIndex = routesFile.indexOf("\n", lastImportIndex) + 1;

    routesFile =
      routesFile.slice(0, insertIndex) +
      importLine +
      "\n" +
      routesFile.slice(insertIndex);
  }

  if (!routesFile.includes(useLine)) {
    const routerUseRegex = /router\.use\([^)]*\);\s*/g;
    const matches = routesFile.match(routerUseRegex);

    if (matches && matches.length > 0) {
      // insert after last router.use
      const lastMatch = matches[matches.length - 1];
      const index = routesFile.lastIndexOf(lastMatch) + lastMatch.length;

      routesFile =
        routesFile.slice(0, index) + useLine + "\n" + routesFile.slice(index);
    } else {
      // no router.use exists, insert after Router()
      routesFile = routesFile.replace(
        /const router = Router\(\);\s*/,
        `const router = Router();\n\n${useLine}\n`
      );
    }
  }

  fs.writeFileSync(routesFilePath, routesFile);
  console.log("🧩 Routes.ts updated");
} else {
  console.warn("⚠️ src/Routes.ts not found. Skipped route registration.");
}

console.log(`✅ Entity "${EntitiesName}" created.`);
console.log(`📁 Location: ${entityDir}`);
