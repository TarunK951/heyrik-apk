import React from "react";
import { Image, Platform } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Button, T, art, s } from "../ui";
import { useStore } from "../store";

export function ProfilePhoto({
  notify,
}: {
  notify: (message: string) => void;
}) {
  const { data, set } = useStore();
  const pick = async (identifier: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/png", "image/webp"],
        copyToCacheDirectory: true,
        base64: true,
      });
      if (result.canceled) return;
      const file = result.assets[0];
      if ((file.size || 0) > 2 * 1024 * 1024) {
        notify("Choose an image up to 2 MB");
        return;
      }
      let photo = file.base64 || "";
      if (Platform.OS !== "web") {
        const { File, Paths } = await import("expo-file-system");
        const destination = new File(
          Paths.document,
          "heyrik-profile-" + identifier,
        );
        await new File(file.uri).copy(destination);
        photo = destination.uri;
        // Only replace files created by this picker; never delete source photos.
        if (
          data.profile.photo?.startsWith(Paths.document.uri + "heyrik-profile-")
        ) {
          try {
            await new File(data.profile.photo).delete();
          } catch {}
        }
      }
      if (!photo) throw new Error("Image unavailable");
      if (Platform.OS === "web" && !photo.startsWith("data:"))
        photo = "data:" + (file.mimeType || "image/jpeg") + ";base64," + photo;
      set((d) => ({ ...d, profile: { ...d.profile, photo } }));
      notify("Photo saved on this device");
    } catch {
      notify("Unable to load photo. Try a smaller JPG or PNG.");
    }
  };
  return (
    <>
      <Image
        source={data.profile.photo ? { uri: data.profile.photo } : art.ember}
        style={{ width: 70, height: 70, borderRadius: 35 }}
      />
      <Button
        outline
        label="Change photo"
        icon="image"
        onPress={() => pick(Date.now().toString())}
      />
      <T style={s.sub}>JPG, PNG or WebP · up to 2 MB · saved locally</T>
      {!!data.profile.photo && (
        <Button
          outline
          label="Remove photo"
          onPress={() =>
            set((d) => ({ ...d, profile: { ...d.profile, photo: undefined } }))
          }
        />
      )}
    </>
  );
}
