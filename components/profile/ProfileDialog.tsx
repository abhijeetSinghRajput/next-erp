import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStudentStore } from "@/stores/useStudentStore";
import { XIcon } from "lucide-react";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
} from "../motion-primitives/morphing-dialog";
import Image from "next/image";

const ProfileDialog = () => {
  const { student, avatarBlobUrl } = useStudentStore();
  return (
    <MorphingDialog
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      <MorphingDialogTrigger>
        <Avatar className="size-32">
          <AvatarImage
            className="w-full h-full object-cover"
            src={avatarBlobUrl ?? undefined}
          />
          <AvatarFallback className="text-4xl text-muted-foreground">
            {student?.StudentName?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent
          className="relative rounded-3xl"
          style={{ maxWidth: "min(100svw, 70svh)" }}
        >
          {avatarBlobUrl && (
            <div className="relative w-full h-[70svh]">
              <img
                src={avatarBlobUrl}
                alt={student?.StudentName || "student profile"}
                className="object-contain rounded-3xl"
              />
            </div>
          )}
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
