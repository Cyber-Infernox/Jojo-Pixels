"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useUploadThing } from "@/lib/uploadthingUser";
import { isBase64Image } from "@/lib/utils";

import { PostValidation } from "@/lib/validations/post";
import { createPost } from "@/lib/actions/post.actions";
import Image from "next/image";

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    city: string;
    country: string;
    name: string;
    bio: string;
    image: string;
  };
  userId: string;
}

function Post({ user, userId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { startUpload } = useUploadThing("media");

  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      post_photo: user?.image ? user.image : "",
      post: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof PostValidation>) => {
    // console.log("Hello");

    const blob = values.post_photo;

    const hasImageChanged = isBase64Image(blob);
    if (hasImageChanged) {
      const imgRes = await startUpload(files);

      if (imgRes && imgRes[0].url) {
        values.post_photo = imgRes[0].url;
      }
    }

    await createPost({
      text: values.post,
      author: userId,
      path: pathname,
      image: values.post_photo,
    });

    router.push("/");
  };

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form
        className="mt-10 flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="post_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="flex h-[350px] w-[450px] items-center justify-center bg-dark-4 ml-[15px]">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile_icon"
                    width={96}
                    height={96}
                    priority
                    className="h-[350px] w-[450px] object-contain"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="profile_icon"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold mb-[-10px] text-md ml-[15px]">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Add profile photo"
                  className="account-form_image-input"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="post"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3 mt-[-15px]">
              <FormLabel className="text-base-semibold text-xl mb-[-10px] font-bold ml-[20px]">
                Caption
              </FormLabel>
              <FormControl className="no-focus border ml-[15px] border-dark-4 bg-dark-3 text-light-1 w-[1210px]">
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-[-15px] ml-[15px] bg-primary-500">
          Post Picture
        </Button>
      </form>
    </Form>
  );
}

export default Post;
