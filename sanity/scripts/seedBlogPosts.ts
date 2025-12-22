import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import { createClient } from "@sanity/client";
import * as fs from "fs";
import * as path from "path";

// Read environment variables directly after loading dotenv
function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}

const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"
);

const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET"
);

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-06-06";

// Create a write-enabled client
// Note: You'll need to set SANITY_API_TOKEN in your environment
const token = assertValue(
  process.env.SANITY_API_TOKEN,
  "SANITY_API_TOKEN environment variable is required. Get your token from https://www.sanity.io/manage"
);

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

// Helper to generate unique keys
let keyCounter = 0;
function generateKey(): string {
  return `key-${Date.now()}-${++keyCounter}-${Math.random().toString(36).substr(2, 9)}`;
}

// Helper to create slug from title
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Helper to create a text block
function createTextBlock(
  text: string,
  style: "normal" | "h1" | "h2" | "h3" = "normal"
) {
  return {
    _key: generateKey(),
    _type: "block",
    style,
    children: [
      {
        _key: generateKey(),
        _type: "span",
        text,
      },
    ],
    markDefs: [],
  };
}

// Helper to create a block quote
function createBlockQuote(quote: string, author?: string, citation?: string) {
  return {
    _key: generateKey(),
    _type: "blockQuote",
    quote,
    ...(author && { author }),
    ...(citation && { citation }),
  };
}

async function uploadImage(filePath: string, filename: string) {
  const buffer = fs.readFileSync(filePath);
  const asset = await client.assets.upload("image", buffer, {
    filename,
    contentType: "image/png",
  });
  return asset._id;
}

async function findOrCreateAuthor() {
  // Check if author already exists
  const existing = await client.fetch(
    `*[_type == "author" && name == "Anna Douglas"][0]`
  );

  if (existing) {
    console.log("✓ Author 'Anna Douglas' already exists");
    return existing._id;
  }

  // Upload image
  const imagePath = path.join(
    process.cwd(),
    "sanity",
    "scripts",
    "assets",
    "anna-douglas.png"
  );
  console.log("Uploading author image...");
  const imageId = await uploadImage(imagePath, "anna-douglas.png");

  // Create author
  const author = await client.create({
    _type: "author",
    name: "Anna Douglas",
    image: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: imageId,
      },
    },
  });

  console.log("✓ Created author: Anna Douglas");
  return author._id;
}

async function findOrCreateTags() {
  const tagNames = [
    "Interior Design",
    "Home Styling",
    "Kitchen Design",
    "Living Room",
    "Bedroom",
    "Minimalist",
    "Modern",
    "Vintage",
    "DIY",
    "Renovation",
  ];

  const tagIds: string[] = [];

  for (const tagName of tagNames) {
    // Check if tag exists
    const existing = await client.fetch(
      `*[_type == "tag" && title == $name][0]`,
      { name: tagName }
    );

    if (existing) {
      tagIds.push(existing._id);
      console.log(`✓ Tag '${tagName}' already exists`);
    } else {
      const tag = await client.create({
        _type: "tag",
        title: tagName,
        slug: {
          _type: "slug",
          current: slugify(tagName),
        },
      });
      tagIds.push(tag._id);
      console.log(`✓ Created tag: ${tagName}`);
    }
  }

  return tagIds;
}

// Blog post data
const blogPosts = [
  {
    title:
      "Transforming Small Spaces: Maximizing Style in Minimal Square Footage",
    excerpt:
      "Discover creative solutions for making the most of compact living spaces without sacrificing style or functionality.",
    tags: ["Interior Design", "Home Styling", "Minimalist"],
    content: [
      createTextBlock(
        "Transforming Small Spaces: Maximizing Style in Minimal Square Footage",
        "h1"
      ),
      createTextBlock(
        "Living in a small space doesn't mean you have to compromise on style. With the right design strategies, you can create a home that feels spacious, organized, and beautifully curated."
      ),
      createTextBlock(
        "The key to successful small space design lies in understanding how to maximize every square foot while maintaining a sense of openness and flow."
      ),
      createBlockQuote(
        "Good design is not about how much space you have, but how you use the space you're given.",
        "Anna Douglas",
        "The Layered Home"
      ),
      createTextBlock("Smart Storage Solutions", "h2"),
      createTextBlock(
        "One of the most effective ways to maximize small spaces is through intelligent storage solutions. Built-in shelving, multi-functional furniture, and vertical storage can dramatically increase your usable space."
      ),
    ],
    publishedAt: new Date("2024-11-15T10:00:00Z").toISOString(),
  },
  {
    title: "The Art of Layering: Creating Depth in Your Home Design",
    excerpt:
      "Learn how to layer textures, colors, and patterns to create a rich, inviting atmosphere in any room.",
    tags: ["Interior Design", "Home Styling", "Modern"],
    content: [
      createTextBlock(
        "The Art of Layering: Creating Depth in Your Home Design",
        "h1"
      ),
      createTextBlock(
        "Layering is one of the most powerful techniques in interior design. It's about creating visual interest and depth through the thoughtful combination of different elements."
      ),
      createTextBlock(
        "When done correctly, layering transforms a flat, one-dimensional space into a rich, multi-layered environment that invites exploration and creates a sense of comfort."
      ),
      createTextBlock("Understanding Texture", "h2"),
      createTextBlock(
        "Texture plays a crucial role in layering. Combine smooth surfaces with rough ones, soft fabrics with hard materials, and matte finishes with glossy accents."
      ),
      createTextBlock("Color and Pattern", "h2"),
      createTextBlock(
        "Don't be afraid to mix patterns and colors. Start with a neutral base and gradually add layers of color and pattern, building complexity as you go."
      ),
    ],
    publishedAt: new Date("2024-10-20T14:30:00Z").toISOString(),
  },
  {
    title: "Kitchen Renovation Essentials: Planning Your Dream Space",
    excerpt:
      "A comprehensive guide to planning and executing a kitchen renovation that combines functionality with timeless style.",
    tags: ["Kitchen Design", "Renovation", "DIY"],
    content: [
      createTextBlock(
        "Kitchen Renovation Essentials: Planning Your Dream Space",
        "h1"
      ),
      createTextBlock(
        "The kitchen is often called the heart of the home, and for good reason. It's where we gather, cook, and create memories. A well-designed kitchen renovation can transform not just the space, but how you live in your home."
      ),
      createTextBlock(
        "Before you start tearing down walls, it's essential to have a clear plan that addresses both your immediate needs and long-term goals."
      ),
      createTextBlock("Setting Your Budget", "h2"),
      createTextBlock(
        "The first step in any renovation is establishing a realistic budget. Remember to set aside 10-20% for unexpected expenses that inevitably arise during construction."
      ),
      createBlockQuote(
        "A kitchen renovation is an investment in your home and your lifestyle. Take the time to plan carefully, and you'll create a space you'll love for years to come.",
        "Anna Douglas"
      ),
      createTextBlock("Choosing Your Layout", "h2"),
      createTextBlock(
        "The layout of your kitchen should reflect how you actually use the space. Consider the work triangle, storage needs, and traffic flow when planning your design."
      ),
    ],
    publishedAt: new Date("2024-09-10T09:15:00Z").toISOString(),
  },
  {
    title: "Modern Minimalism: Less is More in Contemporary Design",
    excerpt:
      "Explore how minimalist principles can create serene, uncluttered spaces that promote peace and clarity.",
    tags: ["Minimalist", "Modern", "Interior Design"],
    content: [
      createTextBlock(
        "Modern Minimalism: Less is More in Contemporary Design",
        "h1"
      ),
      createTextBlock(
        "Minimalism isn't about living with nothing—it's about living with intention. Every piece in a minimalist space serves a purpose, and every design choice is deliberate."
      ),
      createTextBlock(
        "This approach to design creates spaces that feel calm, organized, and free from visual clutter, allowing you to focus on what truly matters."
      ),
      createTextBlock("The Principles of Minimalism", "h2"),
      createTextBlock(
        "True minimalism goes beyond aesthetics. It's about quality over quantity, function over form, and creating spaces that support your lifestyle rather than complicate it."
      ),
      createTextBlock("Choosing the Right Pieces", "h2"),
      createTextBlock(
        "In a minimalist space, each item must earn its place. Choose furniture and decor that are both beautiful and functional, and don't be afraid of empty space—it's a design element in itself."
      ),
    ],
    publishedAt: new Date("2024-08-25T11:45:00Z").toISOString(),
  },
  {
    title: "Creating a Cozy Living Room: Warmth and Comfort in Design",
    excerpt:
      "Discover how to design a living room that feels inviting and comfortable while maintaining a sophisticated aesthetic.",
    tags: ["Living Room", "Home Styling", "Interior Design"],
    content: [
      createTextBlock(
        "Creating a Cozy Living Room: Warmth and Comfort in Design",
        "h1"
      ),
      createTextBlock(
        "A cozy living room is more than just comfortable furniture—it's about creating an atmosphere that makes you want to curl up with a good book or gather with loved ones."
      ),
      createTextBlock(
        "The secret to coziness lies in the details: soft textures, warm lighting, personal touches, and a layout that encourages relaxation and connection."
      ),
      createTextBlock("The Power of Texture", "h2"),
      createTextBlock(
        "Layer soft throws, plush pillows, and textured rugs to create a sense of warmth and comfort. Natural materials like wool, cotton, and linen add both visual and tactile interest."
      ),
      createBlockQuote(
        "Home is where the heart is, and a cozy living room is where the heart feels most at peace.",
        "Anna Douglas"
      ),
      createTextBlock("Lighting for Ambiance", "h2"),
      createTextBlock(
        "Warm, layered lighting is essential for creating a cozy atmosphere. Combine overhead lighting with table lamps, floor lamps, and candles to create pools of light throughout the space."
      ),
    ],
    publishedAt: new Date("2024-07-18T16:20:00Z").toISOString(),
  },
  {
    title: "Bedroom Sanctuary: Designing Your Personal Retreat",
    excerpt:
      "Transform your bedroom into a peaceful sanctuary that promotes rest and rejuvenation through thoughtful design choices.",
    tags: ["Bedroom", "Interior Design", "Home Styling"],
    content: [
      createTextBlock(
        "Bedroom Sanctuary: Designing Your Personal Retreat",
        "h1"
      ),
      createTextBlock(
        "Your bedroom should be a sanctuary—a place where you can escape the stresses of daily life and truly rest. Creating this peaceful retreat requires careful attention to color, texture, and layout."
      ),
      createTextBlock(
        "The best bedrooms balance aesthetics with function, creating a space that's both beautiful and conducive to restful sleep."
      ),
      createTextBlock("Color Psychology", "h2"),
      createTextBlock(
        "Soft, muted colors like sage green, dusty blue, and warm beige create a calming atmosphere. Avoid bright, stimulating colors that can interfere with sleep."
      ),
      createTextBlock("The Importance of Quality Bedding", "h2"),
      createTextBlock(
        "Invest in high-quality bedding that feels luxurious against your skin. Natural fibers like cotton and linen are breathable and comfortable, promoting better sleep."
      ),
    ],
    publishedAt: new Date("2024-06-12T08:30:00Z").toISOString(),
  },
  {
    title: "Vintage Meets Modern: Blending Eras in Interior Design",
    excerpt:
      "Learn how to successfully combine vintage pieces with modern elements to create a unique, timeless aesthetic.",
    tags: ["Vintage", "Modern", "Interior Design"],
    content: [
      createTextBlock(
        "Vintage Meets Modern: Blending Eras in Interior Design",
        "h1"
      ),
      createTextBlock(
        "The most interesting interiors often blend elements from different eras, creating a space that feels both timeless and contemporary. This approach allows you to honor the past while embracing the present."
      ),
      createTextBlock(
        "Successfully mixing vintage and modern requires a careful balance and an understanding of how different styles can complement each other."
      ),
      createTextBlock("Finding the Right Balance", "h2"),
      createTextBlock(
        "The key is to let one era dominate while using the other as an accent. For example, a modern room with vintage accessories, or a vintage-inspired space with contemporary lighting."
      ),
      createBlockQuote(
        "The best designs tell a story. Mixing vintage and modern pieces allows you to create a narrative that spans generations.",
        "Anna Douglas"
      ),
      createTextBlock("Where to Find Vintage Pieces", "h2"),
      createTextBlock(
        "Thrift stores, estate sales, and online marketplaces are treasure troves for unique vintage finds. Look for pieces with good bones and interesting character."
      ),
    ],
    publishedAt: new Date("2024-05-08T13:00:00Z").toISOString(),
  },
  {
    title: "DIY Home Projects: Simple Updates That Make a Big Impact",
    excerpt:
      "Discover easy DIY projects that can transform your space without breaking the bank or requiring professional help.",
    tags: ["DIY", "Home Styling", "Renovation"],
    content: [
      createTextBlock(
        "DIY Home Projects: Simple Updates That Make a Big Impact",
        "h1"
      ),
      createTextBlock(
        "You don't need a huge budget or professional contractors to make significant improvements to your home. With a little creativity and elbow grease, you can tackle projects that dramatically enhance your space."
      ),
      createTextBlock(
        "The best DIY projects are those that provide maximum impact with minimal investment, both in terms of time and money."
      ),
      createTextBlock("Paint: The Easiest Transformation", "h2"),
      createTextBlock(
        "A fresh coat of paint is one of the most cost-effective ways to transform a room. Consider painting an accent wall, updating trim, or even painting furniture for a quick refresh."
      ),
      createTextBlock("Hardware Updates", "h2"),
      createTextBlock(
        "Swapping out old hardware on cabinets, doors, and drawers can instantly modernize a space. It's a small change that makes a big difference."
      ),
    ],
    publishedAt: new Date("2024-04-22T10:15:00Z").toISOString(),
  },
  {
    title: "The Psychology of Color in Home Design",
    excerpt:
      "Understand how different colors affect mood and behavior, and learn to use color strategically in your home.",
    tags: ["Interior Design", "Home Styling"],
    content: [
      createTextBlock("The Psychology of Color in Home Design", "h1"),
      createTextBlock(
        "Color is one of the most powerful tools in interior design. It can influence mood, affect perception of space, and even impact our behavior and productivity."
      ),
      createTextBlock(
        "Understanding color psychology allows you to make informed choices that support the function and feeling you want each room to have."
      ),
      createTextBlock("Warm Colors", "h2"),
      createTextBlock(
        "Reds, oranges, and yellows are energizing and stimulating. They're perfect for social spaces like dining rooms and kitchens, but should be used sparingly in bedrooms where you want to promote rest."
      ),
      createTextBlock("Cool Colors", "h2"),
      createTextBlock(
        "Blues, greens, and purples are calming and serene. They work well in bedrooms, bathrooms, and any space where you want to create a sense of peace and relaxation."
      ),
    ],
    publishedAt: new Date("2024-03-15T14:45:00Z").toISOString(),
  },
  {
    title: "Maximizing Natural Light: Brightening Your Home",
    excerpt:
      "Learn strategies for bringing more natural light into your home and making the most of the light you have.",
    tags: ["Home Styling", "Interior Design", "DIY"],
    content: [
      createTextBlock("Maximizing Natural Light: Brightening Your Home", "h1"),
      createTextBlock(
        "Natural light is one of the most valuable assets in any home. It makes spaces feel larger, improves mood, and can even reduce energy costs. Yet many homes don't make the most of the natural light available."
      ),
      createTextBlock(
        "With a few strategic changes, you can dramatically increase the amount of natural light in your home and create brighter, more inviting spaces."
      ),
      createTextBlock("Window Treatments", "h2"),
      createTextBlock(
        "Choose light, airy window treatments that allow light to filter through. Sheer curtains, light-filtering blinds, or even no window treatments at all can maximize light."
      ),
      createBlockQuote(
        "Light is the most important element in design. It defines space, creates mood, and brings a room to life.",
        "Anna Douglas"
      ),
      createTextBlock("Reflective Surfaces", "h2"),
      createTextBlock(
        "Mirrors and other reflective surfaces can bounce light around a room, making it feel brighter and more spacious. Place mirrors opposite windows for maximum effect."
      ),
    ],
    publishedAt: new Date("2024-02-28T09:30:00Z").toISOString(),
  },
  {
    title: "Sustainable Home Design: Eco-Friendly Choices for Modern Living",
    excerpt:
      "Explore how to make environmentally conscious design choices without sacrificing style or comfort.",
    tags: ["Interior Design", "Home Styling", "Modern"],
    content: [
      createTextBlock(
        "Sustainable Home Design: Eco-Friendly Choices for Modern Living",
        "h1"
      ),
      createTextBlock(
        "Sustainable design isn't just about being environmentally responsible—it's about creating healthier, more durable homes that stand the test of time."
      ),
      createTextBlock(
        "Making eco-friendly choices in your home design can improve air quality, reduce waste, and create a space that aligns with your values."
      ),
      createTextBlock("Choosing Sustainable Materials", "h2"),
      createTextBlock(
        "Look for materials that are renewable, recycled, or sustainably sourced. Bamboo, cork, reclaimed wood, and natural fibers are excellent choices for flooring, furniture, and textiles."
      ),
      createTextBlock("Energy Efficiency", "h2"),
      createTextBlock(
        "Consider energy-efficient lighting, appliances, and windows. These choices not only reduce your environmental impact but also lower your utility bills over time."
      ),
    ],
    publishedAt: new Date("2024-01-20T11:00:00Z").toISOString(),
  },
  {
    title: "Open Concept Living: Designing for Flow and Function",
    excerpt:
      "Learn how to design open concept spaces that feel cohesive while maintaining distinct areas for different activities.",
    tags: ["Living Room", "Interior Design", "Modern"],
    content: [
      createTextBlock(
        "Open Concept Living: Designing for Flow and Function",
        "h1"
      ),
      createTextBlock(
        "Open concept living has become increasingly popular, and for good reason. It creates a sense of spaciousness, improves natural light flow, and makes homes feel more connected."
      ),
      createTextBlock(
        "However, designing an open concept space requires careful planning to ensure each area has its own identity while maintaining visual cohesion."
      ),
      createTextBlock("Defining Zones", "h2"),
      createTextBlock(
        "Use furniture, rugs, and lighting to define different zones within an open space. A large area rug can anchor a living area, while a dining table and pendant light create a distinct dining zone."
      ),
      createTextBlock("Visual Continuity", "h2"),
      createTextBlock(
        "Maintain visual continuity through consistent color palettes, materials, and design styles. This creates a cohesive look while allowing each zone to have its own character."
      ),
    ],
    publishedAt: new Date("2023-12-10T15:30:00Z").toISOString(),
  },
  {
    title: "Seasonal Decor: Refreshing Your Home for Each Season",
    excerpt:
      "Discover how to update your home decor seasonally without major renovations, keeping your space fresh and inviting year-round.",
    tags: ["Home Styling", "Interior Design"],
    content: [
      createTextBlock(
        "Seasonal Decor: Refreshing Your Home for Each Season",
        "h1"
      ),
      createTextBlock(
        "Your home should evolve with the seasons, reflecting the changing world outside while maintaining your personal style. Seasonal decor doesn't require major changes—small updates can make a big impact."
      ),
      createTextBlock(
        "The key is to have a flexible base design that can accommodate seasonal accents without feeling disjointed or cluttered."
      ),
      createTextBlock("Textile Swaps", "h2"),
      createTextBlock(
        "One of the easiest ways to update for the season is through textiles. Swap out throw pillows, blankets, and even curtains to reflect the season's colors and textures."
      ),
      createBlockQuote(
        "A well-designed home is like a good wardrobe—it has a solid foundation with pieces that can be mixed and matched for different occasions and seasons.",
        "Anna Douglas"
      ),
      createTextBlock("Natural Elements", "h2"),
      createTextBlock(
        "Bring the outside in with seasonal natural elements. Fresh flowers in spring, branches in fall, and evergreen arrangements in winter add life and seasonal character to any space."
      ),
    ],
    publishedAt: new Date("2023-11-05T10:45:00Z").toISOString(),
  },
  {
    title: "Storage Solutions: Decluttering and Organizing Your Home",
    excerpt:
      "Practical strategies for creating effective storage solutions that keep your home organized and clutter-free.",
    tags: ["Home Styling", "DIY", "Interior Design"],
    content: [
      createTextBlock(
        "Storage Solutions: Decluttering and Organizing Your Home",
        "h1"
      ),
      createTextBlock(
        "Effective storage is the foundation of a well-organized home. When everything has a place, your space feels calmer, more functional, and easier to maintain."
      ),
      createTextBlock(
        "The best storage solutions are those that are both functional and beautiful, integrating seamlessly into your home's design."
      ),
      createTextBlock("The Decluttering Process", "h2"),
      createTextBlock(
        "Before you can create effective storage, you need to declutter. Go through each room systematically, keeping only what you use, love, or need. This creates space for better organization."
      ),
      createTextBlock("Hidden Storage", "h2"),
      createTextBlock(
        "Look for opportunities to create hidden storage. Under-bed storage, built-in cabinets, and multi-functional furniture can provide storage without taking up additional space."
      ),
    ],
    publishedAt: new Date("2023-10-18T13:20:00Z").toISOString(),
  },
  {
    title: "Designing for Entertaining: Creating Spaces That Welcome Guests",
    excerpt:
      "Learn how to design your home with entertaining in mind, creating flexible spaces that accommodate both intimate gatherings and larger parties.",
    tags: ["Living Room", "Home Styling", "Interior Design"],
    content: [
      createTextBlock(
        "Designing for Entertaining: Creating Spaces That Welcome Guests",
        "h1"
      ),
      createTextBlock(
        "A home designed for entertaining is one that makes guests feel welcome and comfortable while allowing you to host with ease. This requires thoughtful planning of both layout and furnishings."
      ),
      createTextBlock(
        "The best entertaining spaces are flexible, allowing for different group sizes and activities while maintaining a cohesive design aesthetic."
      ),
      createTextBlock("Flexible Seating", "h2"),
      createTextBlock(
        "Create flexible seating arrangements that can be easily reconfigured. Modular furniture, ottomans that double as seating, and lightweight chairs that can be moved around are essential."
      ),
      createTextBlock("Flow and Circulation", "h2"),
      createTextBlock(
        "Ensure there's enough space for people to move around comfortably. Clear pathways and open areas prevent bottlenecks and make guests feel at ease."
      ),
    ],
    publishedAt: new Date("2023-09-30T16:00:00Z").toISOString(),
  },
];

async function createBlogPosts(authorId: string, tagIds: string[]) {
  const tagMap: Record<string, string> = {};
  const tagNames = [
    "Interior Design",
    "Home Styling",
    "Kitchen Design",
    "Living Room",
    "Bedroom",
    "Minimalist",
    "Modern",
    "Vintage",
    "DIY",
    "Renovation",
  ];
  tagNames.forEach((name, index) => {
    tagMap[name] = tagIds[index];
  });

  for (let i = 0; i < blogPosts.length; i++) {
    const post = blogPosts[i];

    // Check if post already exists
    const slug = slugify(post.title);
    const existing = await client.fetch(
      `*[_type == "blogPost" && slug.current == $slug][0]`,
      { slug }
    );

    if (existing) {
      console.log(`✓ Blog post '${post.title}' already exists`);
      continue;
    }

    // Get tag references with keys
    const postTagRefs = post.tags.map((tagName) => ({
      _key: generateKey(),
      _type: "reference",
      _ref: tagMap[tagName],
    }));

    // Create the blog post
    const blogPost = await client.create({
      _type: "blogPost",
      title: post.title,
      slug: {
        _type: "slug",
        current: slug,
      },
      content: post.content,
      author: {
        _type: "reference",
        _ref: authorId,
      },
      tags: postTagRefs,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
    });

    console.log(`✓ Created blog post: ${post.title}`);
  }
}

async function main() {
  try {
    console.log("Starting blog post seed...\n");

    // Create author
    const authorId = await findOrCreateAuthor();
    console.log("");

    // Create tags
    const tagIds = await findOrCreateTags();
    console.log("");

    // Create blog posts
    console.log("Creating blog posts...");
    await createBlogPosts(authorId, tagIds);
    console.log("");

    console.log("✓ Seed completed successfully!");
  } catch (error) {
    console.error("Error seeding blog posts:", error);
    process.exit(1);
  }
}

main();

