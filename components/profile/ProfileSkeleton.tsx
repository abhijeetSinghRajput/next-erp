"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Phone,
  Cake,
  BookText,
  UserCircle,
  Home,
  WalletCards,
  GraduationCap,
} from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const ProfileSkeleton = () => {
  const [activeTab, setActiveTab] = useState(0);

  const TABS = [
    { id: 0, title: "Academic", icon: <GraduationCap className="h-4 w-4" /> },
    { id: 1, title: "Education", icon: <BookText className="h-4 w-4" /> },
    { id: 2, title: "Personal", icon: <UserCircle className="h-4 w-4" /> },
  ];

  return (
    <div className="max-w-screen-lg mx-auto px-2 sm:px-4 md:px-6 py-2">
      <Card className="overflow-hidden">
        {/* Profile Header */}
        <CardHeader className="px-8 py-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Skeleton className={"size-32 rounded-full"}/>

            <div className="text-center md:text-left space-y-2">
              <CardTitle className="text-3xl font-bold tracking-tight">
                <Skeleton className="h-9" />
              </CardTitle>
              <div className="text-lg font-medium text-muted-foreground">
                <Skeleton className="h-6 w-[250px]" />
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-12" />
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Tab Navigation */}
        <div className="border-b bg-muted/40">
          <div className="flex p-2 gap-2 justify-center">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-md px-3 py-2 text-sm font-medium flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-background text-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {tab.icon}
                {tab.title}
              </button>
            ))}
          </div>
        </div>

        <CardContent className="p-0">
          {/* Academic Tab */}
          {activeTab === 0 && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase mb-2">
                      Enrollment Details
                    </h3>
                    <dl className="space-y-4">
                      <div className="flex items-start">
                        <dt className="w-40 flex-shrink-0 text-sm font-medium text-muted-foreground">
                          Enrollment No
                        </dt>
                        <dd className="text-sm font-mono">
                          <Skeleton className="h-5 w-24" />
                        </dd>
                      </div>
                      <div className="flex items-start">
                        <dt className="w-40 flex-shrink-0 text-sm font-medium text-muted-foreground">
                          University Roll No
                        </dt>
                        <dd className="text-sm font-mono">
                          <Skeleton className="h-5 w-24" />
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase mb-2">
                      Contact Information
                    </h3>
                    <dl className="space-y-4">
                      <div className="flex items-start">
                        <dt className="w-40 flex-shrink-0 text-sm font-medium text-muted-foreground">
                          Personal Email
                        </dt>
                        <dd className="text-sm">
                          <Skeleton className="h-5 w-[200px]" />
                        </dd>
                      </div>
                      <div className="flex items-start">
                        <dt className="w-40 flex-shrink-0 text-sm font-medium text-muted-foreground">
                          University Email
                        </dt>
                        <dd className="text-sm">
                          <Skeleton className="h-5 w-[150px]" />
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 1 && (
            <div className="p-8">
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase mb-4">
                    Academic Performance
                  </h3>
                  <div className="space-y-6">
                    {["10th Grade", "12th Grade", "Graduation"].map((level) => (
                      <div key={level}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{level}</span>
                          <span className="text-sm font-medium">
                            <Skeleton className="h-5 w-12" />
                          </span>
                        </div>
                        <Skeleton className="w-full h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Personal Tab */}
          {activeTab === 2 && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase mb-4">
                      Personal Details
                    </h3>
                    <dl className="space-y-4">
                      {[
                        { icon: <Phone className="h-4 w-4" />, label: "Mobile", width: 20 },
                        { icon: <Cake className="h-4 w-4" />, label: "Date of Birth", width: 20 },
                        { icon: <WalletCards className="h-4 w-4" />, label: "ABC Account", width: 24 },
                      ].map(({ icon, label, width }) => (
                        <div className="flex items-start" key={label}>
                          <dt className="w-40 flex-shrink-0 text-sm font-medium text-muted-foreground">
                            <div className="flex items-center gap-2">{icon} {label}</div>
                          </dt>
                          <Skeleton className={`h-5 w-${width}`} />
                        </div>
                      ))}

                      <div className="flex items-start">
                        <dt className="w-40 flex-shrink-0 text-sm font-medium text-muted-foreground">
                          <div className="flex items-center gap-2"><Home className="h-4 w-4" /> Address</div>
                        </dt>
                        <div className="space-y-1 w-full">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-1/2 max-w-52" />
                        </div>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Family Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase mb-4">
                      Family Details
                    </h3>
                    <dl className="space-y-4">
                      {["Father&apos;s Name", "Father&apos;s Mobile", "Mother&apos;s Name"].map((label) => (
                        <div className="flex items-start" key={label}>
                          <dt className="w-40 flex-shrink-0 text-sm font-medium text-muted-foreground">{label}</dt>
                          <Skeleton className="h-5 w-20" />
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSkeleton;
