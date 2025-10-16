import type { MetaFunction } from "@remix-run/cloudflare";
import { useRef } from "react";
import { Intro } from "~/routes/home/intro";
import config from "~/config.json";

export const meta: MetaFunction = () => {
  return [
    { title: "Ryan Norin" },
    { name: `Personal portfolio of ${config.name} - a product designer working on desktop and web apps with a focus on UI, motion, and design`, content: "Welcome!" },
  ];
};

export default function Home() {
    const intro = useRef();

  return (
    <>
        <Intro
            id="intro"
            sectionRef={intro}
        />
    </>
  );
}

export class home {
}