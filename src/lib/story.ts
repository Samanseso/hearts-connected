// src/lib/story.ts

// First, import the necessary classes
import { Story } from "narraleaf-react";
import { scene1 } from "@/scenes/scene1";
import { persis } from "@/lib/persistents";

// Create a new story
// The name of the story is human-readable and is used for debugging purposes
const story = new Story("Beyond the Screen");

story.registerPersistent(persis);




// Add the scene to the story
story.entry(scene1);

export { story };

