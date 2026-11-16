import React from "react";
import * as DocumentPicker from "expo-document-picker";
import { Button, Row, IB, T, s } from "../ui";

type Attachment = { name: string; size?: number };
export function Attachments({
  value = [],
  onChange,
  notify,
}: {
  value?: Attachment[];
  onChange: (items: Attachment[]) => void;
  notify: (message: string) => void;
}) {
  const pick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/png", "image/jpeg", "image/webp"],
        multiple: true,
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const valid = result.assets.filter(
        (file) => (file.size || 0) <= 10 * 1024 * 1024,
      );
      if (valid.length !== result.assets.length)
        notify("Each image must be at most 10 MB");
      if (valid.length + value.length > 3)
        notify("Up to three screenshots per ticket");
      onChange(
        [...value, ...valid.map(({ name, size }) => ({ name, size }))].slice(
          0,
          3,
        ),
      );
    } catch {
      notify("Unable to open the image picker");
    }
  };
  return (
    <>
      <Button
        outline
        label="Attach screenshots"
        icon="paperclip"
        disabled={value.length >= 3}
        onPress={pick}
      />
      <T style={s.sub}>
        Up to 3 images · 10 MB each. This preview saves filenames only; nothing
        is uploaded.
      </T>
      {value.map((file, index) => (
        <Row
          key={index}
          title={file.name}
          sub={Math.ceil((file.size || 0) / 1024) + " KB"}
          right={
            <IB
              name="x"
              label={"Remove " + file.name}
              onPress={() => onChange(value.filter((_, i) => i !== index))}
            />
          }
        />
      ))}
    </>
  );
}
