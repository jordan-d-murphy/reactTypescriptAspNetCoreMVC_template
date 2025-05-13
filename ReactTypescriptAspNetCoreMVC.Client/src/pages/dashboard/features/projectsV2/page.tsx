import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AlbumArtwork } from "./components/album-artwork";
import { Menu } from "./components/menu";
import { PodcastEmptyPlaceholder } from "./components/podcast-empty-placeholder";
import { Sidebar } from "./components/sidebar";
import { listenNowAlbums, madeForYouAlbums } from "./data/albums";
import { playlists } from "./data/playlists";
import { useState } from "react";

export default function ProjectsV2Page() {
  const [selectedTab, setSelectedTab] = useState("listenNow");
  return (
    <>
      <div className="hidden md:block">
        <Menu />
        <div className="border-t">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <Sidebar
                playlists={playlists}
                className="hidden lg:block"
                onSelectTab={setSelectedTab}
                selectedTab={selectedTab}
              />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8 text-left">
                  <Tabs
                    value={selectedTab}
                    onValueChange={setSelectedTab}
                    defaultValue="listenNow"
                    className="h-full space-y-6"
                  >
                    <div className="space-between flex items-center">
                      <TabsList>
                        <TabsTrigger value="listenNow" className="relative">
                          Listen Now
                        </TabsTrigger>
                        <TabsTrigger value="browse">Browse</TabsTrigger>
                        <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
                        <TabsTrigger value="live">Live</TabsTrigger>
                      </TabsList>
                      <div className="ml-auto mr-4">
                        <Button>
                          <PlusCircle />
                          Add music
                        </Button>
                      </div>
                    </div>
                    <TabsContent value="listenNow" className="border-none p-0 outline-none">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">Listen Now</h2>
                          <p className="text-sm text-muted-foreground">Top picks for you. Updated daily.</p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <PodcastEmptyPlaceholder context="listenNow" />
                    </TabsContent>
                    <TabsContent value="browse" className="border-none p-0 outline-none">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">Explore the Catalogue</h2>
                          <p className="text-sm text-muted-foreground">Find something new.</p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <PodcastEmptyPlaceholder context="browse" />
                    </TabsContent>
                    <TabsContent value="podcasts" className="h-full flex-col border-none p-0 data-[state=active]:flex">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">New Episodes</h2>
                          <p className="text-sm text-muted-foreground">Your favorite podcasts. Updated daily.</p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <PodcastEmptyPlaceholder context="podcasts" />
                    </TabsContent>
                    <TabsContent value="live" className="h-full flex-col border-none p-0 data-[state=active]:flex">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">New Live Streams</h2>
                          <p className="text-sm text-muted-foreground">
                            Your favorite Live Streams. Updated in real time.
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <PodcastEmptyPlaceholder context="live" />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
