"use client";

import React, { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useStudentStore } from "../../stores/useStudentStore";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import IdCard from "./IdCard";
import { XIcon } from "lucide-react";
import ProfilePhotoUploader from "./ProfilePhotoUploader";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
} from "../motion-primitives/morphing-dialog";
import Image from "next/image";

const ProfileDialog = () => {
  const { student } = useStudentStore();
  const { idCard, loadingIdCard, getIdCard } = useStudentStore();

  useEffect(() => {
    getIdCard();
  }, [getIdCard]);

  return (
    <MorphingDialog
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      <MorphingDialogTrigger>
        {loadingIdCard ? (
          <div className="rounded-full overflow-hidden animate-pulse">
            <Image
              src="/avatar.svg"
              alt="Avatar"
              width={128}
              height={128}
              className="opacity-20 object-cover"
            />
          </div>
        ) : (
          <div className="relative">
            <Avatar className="size-32">
              <AvatarImage src={idCard?.Photo} className={undefined} />
              <AvatarFallback className="text-4xl text-muted-foreground">
                {student.StudentName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div
              className="absolute bottom-0 right-0"
              onClick={(e) => e.stopPropagation()}
            >
              <ProfilePhotoUploader />
            </div>
          </div>
        )}
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent
          className="relative rounded-none"
          style={{
            maxWidth: "min(100svw, 70svh)",
          }}
        >
          <ScrollArea className={undefined}>
            {/* <img src={avatarBlobUrl} /> */}
            <IdCard />
            <ScrollBar orientation="horizontal" className={undefined} />
          </ScrollArea>
        </MorphingDialogContent>
        <MorphingDialogClose
          className="fixed right-6 top-6 h-fit w-fit rounded-full bg-white p-1"
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: { delay: 0.3, duration: 0.1 },
            },
            exit: { opacity: 0, transition: { duration: 0 } },
          }}
        >
          <XIcon className="h-5 w-5 text-zinc-500" />
        </MorphingDialogClose>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
};

export default ProfileDialog;
