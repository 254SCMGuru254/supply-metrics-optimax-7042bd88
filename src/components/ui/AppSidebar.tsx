import { modelFormulaRegistry } from "@/data/modelFormulaRegistry";

<div className="mt-6">
  <div className="text-xs font-semibold text-muted-foreground mb-2">MODELS</div>
  <ul className="space-y-1">
    {modelFormulaRegistry.map(model => (
      <li key={model.id}>
        <a href={`/${model.id.replace(/-/g, "")}`}
           className="flex items-center px-3 py-2 rounded hover:bg-muted transition-colors">
          <span className="mr-2">
            <span className="icon-placeholder" />
          </span>
          <span>{model.name}</span>
        </a>
      </li>
    ))}
  </ul>
</div> 