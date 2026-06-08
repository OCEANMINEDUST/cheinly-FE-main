import { ChangeEvent, useRef } from "react";
import { Camera, ImagePlus, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export interface PackagingItem {
  id: string;
  name: string;
  qty: number;
  notes?: string;
  photos: string[];
}

export function makeEmptyItem(): PackagingItem {
  return {
    id: (typeof crypto !== "undefined" && "randomUUID" in crypto)
      ? crypto.randomUUID()
      : `pi_${Math.random().toString(36).slice(2)}`,
    name: "",
    qty: 1,
    notes: "",
    photos: [],
  };
}

interface Props {
  items: PackagingItem[];
  onChange: (items: PackagingItem[]) => void;
  title?: string;
  description?: string;
  maxPhotosPerItem?: number;
}

export function PackagingItemsList({
  items,
  onChange,
  title = "Packaging contents",
  description = "List each item being packed. Add photos for every item — if a listing contains more than one piece, capture each piece individually.",
  maxPhotosPerItem = 6,
}: Props) {
  const update = (id: string, patch: Partial<PackagingItem>) =>
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const remove = (id: string) => onChange(items.filter((i) => i.id !== id));

  const add = () => onChange([...items, makeEmptyItem()]);

  const handleFiles = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const current = items.find((i) => i.id === id);
    if (!current) return;
    const room = Math.max(0, maxPhotosPerItem - current.photos.length);
    const next = files.slice(0, room);
    Promise.all(
      next.map(
        (f) =>
          new Promise<string>((resolve) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result as string);
            r.readAsDataURL(f);
          }),
      ),
    ).then((urls) => {
      update(id, { photos: [...current.photos, ...urls] });
    });
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={add}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Add item
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-secondary/30 p-6 text-center text-sm text-muted-foreground">
          No items yet. Click <strong>Add item</strong> to start the packaging list.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <ItemRow
              key={item.id}
              index={idx}
              item={item}
              onPatch={(p) => update(item.id, p)}
              onRemove={() => remove(item.id)}
              onFiles={(e) => handleFiles(item.id, e)}
              maxPhotos={maxPhotosPerItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ItemRow({
  index,
  item,
  onPatch,
  onRemove,
  onFiles,
  maxPhotos,
}: {
  index: number;
  item: PackagingItem;
  onPatch: (p: Partial<PackagingItem>) => void;
  onRemove: () => void;
  onFiles: (e: ChangeEvent<HTMLInputElement>) => void;
  maxPhotos: number;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const canAddPhoto = item.photos.length < maxPhotos;

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Item {index + 1}
          </span>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 text-destructive hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" /> Remove
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_110px]">
          <div className="space-y-1.5">
            <Label htmlFor={`name-${item.id}`} className="text-xs">Product / item name</Label>
            <Input
              id={`name-${item.id}`}
              value={item.name}
              onChange={(e) => onPatch({ name: e.target.value })}
              placeholder="e.g. Velvet Wrap Dress – Emerald M"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`qty-${item.id}`} className="text-xs">Qty</Label>
            <Input
              id={`qty-${item.id}`}
              type="number"
              min={1}
              value={item.qty}
              onChange={(e) => onPatch({ qty: Math.max(1, Number(e.target.value) || 1) })}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`notes-${item.id}`} className="text-xs">Notes (optional)</Label>
          <Input
            id={`notes-${item.id}`}
            value={item.notes ?? ""}
            onChange={(e) => onPatch({ notes: e.target.value })}
            placeholder="Condition, accessories included, etc."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">
              Photos ({item.photos.length}/{maxPhotos})
            </Label>
            <span className="text-[11px] text-muted-foreground">
              Add a photo per piece if quantity &gt; 1
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {item.photos.map((src, i) => (
              <div key={i} className="relative h-20 w-20 overflow-hidden rounded-md border bg-secondary/40">
                <img src={src} alt={`Item ${index + 1} photo ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() =>
                    onPatch({ photos: item.photos.filter((_, j) => j !== i) })
                  }
                  className="absolute right-0.5 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
                  aria-label="Remove photo"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {canAddPhoto && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="grid h-20 w-20 place-items-center rounded-md border-2 border-dashed bg-secondary/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
              >
                {item.photos.length === 0 ? (
                  <ImagePlus className="h-5 w-5" />
                ) : (
                  <Camera className="h-5 w-5" />
                )}
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              className="hidden"
              onChange={onFiles}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}