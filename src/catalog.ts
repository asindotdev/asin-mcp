// Generated from the Asin OpenAPI document. Do not edit by hand.

import type { EndpointEntry } from "./types.js";

export const MODE: "catalog" | "tools" = "tools";

export const CATALOG: readonly EndpointEntry[] = [
  {
    name: "check_product",
    title: "Check the price now",
    path: "/products/{id}/check",
    methods: ["POST"],
    description:
      "Check the price now. Asks for a check right away (1 credit), at most once per 5 minutes; earlier calls return the product unchanged. A paused product has to be resumed first. The check runs in the background; with wait=true the answer waits for it. Read last_e…",
    params: [
      {
        name: "id",
        type: "string",
        required: true,
        description: "product_id returned when the product was added",
      },
      {
        name: "wait",
        type: "boolean",
        required: false,
        description: "Answer once the check is done (up to 45 seconds)",
        default: false,
      },
    ],
  },
  {
    name: "delete_product",
    title: "Stop tracking a product",
    path: "/products/{id}",
    methods: ["DELETE"],
    description:
      "Stop tracking a product. Removes the product and its price history.",
    params: [
      {
        name: "id",
        type: "string",
        required: true,
        description: "product_id returned when the product was added",
      },
    ],
  },
  {
    name: "fetch_offers",
    title: "Read every offer from Amazon",
    path: "/offers",
    methods: ["POST"],
    description:
      "Read every offer from Amazon. Reads the offers on Amazon for 1 credit, refunded if it doesn't answer. A read made in the last 3 hours, by anyone, is returned instead, for free (charged: false). The answer is the same as GET /offers.",
    params: [
      {
        name: "asin",
        type: "string",
        required: true,
        description: "10-character ASIN",
      },
      {
        name: "marketplace",
        type: "string",
        required: false,
        description: "Amazon store, e.g. com for amazon.com",
        enum: [
          "com",
          "co.uk",
          "de",
          "fr",
          "it",
          "es",
          "ca",
          "co.jp",
          "com.br",
          "com.mx",
          "in",
        ],
        default: "com",
      },
      {
        name: "refresh",
        type: "boolean",
        required: false,
        description:
          "Read Amazon again unless the last read is under 5 minutes old (1 credit)",
        default: false,
      },
    ],
  },
  {
    name: "get_account",
    title: "Plan and remaining credits",
    path: "/account",
    methods: ["GET"],
    description:
      "Plan and remaining credits. Your plan, the credits left (monthly allowance and packs), how many products you track and the credits they use per month.",
    params: [],
  },
  {
    name: "get_asin_history",
    title: "Price history of any ASIN",
    path: "/history",
    methods: ["GET"],
    description:
      "Price history of any ASIN. Every price Asin read for an ASIN on a marketplace over the period, whoever tracks it, oldest first, with the lowest, highest and average of those prices. A history of more than 5000 points is thinned evenly, keeping its first and last poi…",
    params: [
      {
        name: "asin",
        type: "string",
        required: true,
        description: "10-character ASIN",
      },
      {
        name: "marketplace",
        type: "string",
        required: false,
        description: "Amazon store, e.g. com for amazon.com",
        enum: [
          "com",
          "co.uk",
          "de",
          "fr",
          "it",
          "es",
          "ca",
          "co.jp",
          "com.br",
          "com.mx",
          "in",
        ],
        default: "com",
      },
      {
        name: "days",
        type: "integer",
        required: false,
        description: "History period in days",
        default: 90,
      },
    ],
  },
  {
    name: "get_offers",
    title: "Offers already known",
    path: "/offers",
    methods: ["GET"],
    description:
      "Offers already known. Who sells the product and at what price, as last read, cheapest first, with Amazon's own price and the cheapest new and used offers (used is only known for Amazon's own outlet). Free: this never reads Amazon or spends a credit. When nobody…",
    params: [
      {
        name: "asin",
        type: "string",
        required: true,
        description: "10-character ASIN",
      },
      {
        name: "marketplace",
        type: "string",
        required: false,
        description: "Amazon store, e.g. com for amazon.com",
        enum: [
          "com",
          "co.uk",
          "de",
          "fr",
          "it",
          "es",
          "ca",
          "co.jp",
          "com.br",
          "com.mx",
          "in",
        ],
        default: "com",
      },
    ],
  },
  {
    name: "get_product",
    title: "Get a product and its price history",
    path: "/products/{id}",
    methods: ["GET"],
    description:
      "Get a product and its price history. The product's latest state and every price read of the period, oldest first. The history covers every read of this ASIN on this marketplace, including those made before you added it, so a product added today can come with months of prices;…",
    params: [
      {
        name: "id",
        type: "string",
        required: true,
        description: "product_id returned when the product was added",
      },
      {
        name: "days",
        type: "integer",
        required: false,
        description: "History period in days",
        default: 90,
      },
    ],
  },
  {
    name: "list_products",
    title: "List tracked products",
    path: "/products",
    methods: ["GET"],
    description:
      "List tracked products. Your watchlist, newest first, with each product's latest state and its recent prices (trend). Filter with asin (and marketplace) to know if a product is tracked, or with filter to get the same lists as the app's tabs.",
    params: [
      {
        name: "asin",
        type: "string",
        required: false,
        description: "Only this ASIN",
      },
      {
        name: "marketplace",
        type: "string",
        required: false,
        description: "Only this Amazon store",
        enum: [
          "com",
          "co.uk",
          "de",
          "fr",
          "it",
          "es",
          "ca",
          "co.jp",
          "com.br",
          "com.mx",
          "in",
        ],
      },
      {
        name: "filter",
        type: "string",
        required: false,
        description:
          "Only the products of one of the app's watchlist filters. all: Every tracked product (default). drops: Cheaper now than when the product was added. target: At or below its target price. out_of_stock: No offer at the last check. attention: The last check didn't go through (last_error is set): no cred…",
        enum: ["all", "drops", "target", "out_of_stock", "attention", "paused"],
        default: "all",
      },
      {
        name: "page",
        type: "integer",
        required: false,
        description: "Page number",
        default: 1,
      },
      {
        name: "limit",
        type: "integer",
        required: false,
        description: "Products per page",
        default: 20,
      },
    ],
  },
  {
    name: "search_amazon",
    title: "Search Amazon",
    path: "/search",
    methods: ["GET"],
    description:
      "Search Amazon. Amazon search results (up to 60, sponsored included), to find the ASIN of a product. Free, limited to 30 searches per hour.",
    params: [
      {
        name: "query",
        type: "string",
        required: true,
        description: "Keywords",
      },
      {
        name: "marketplace",
        type: "string",
        required: false,
        description: "Amazon store, e.g. com for amazon.com",
        enum: [
          "com",
          "co.uk",
          "de",
          "fr",
          "it",
          "es",
          "ca",
          "co.jp",
          "com.br",
          "com.mx",
          "in",
        ],
        default: "com",
      },
    ],
  },
  {
    name: "track_product",
    title: "Track a product",
    path: "/products",
    methods: ["POST"],
    description:
      "Track a product. Adds an ASIN, an Amazon link or a short link (amzn.to, a.co…) to your watchlist. The first check runs in the background within seconds (checking is true until then): poll GET /products/{id}, or send wait: true to get the answer once it's d…",
    params: [
      {
        name: "product",
        type: "string",
        required: true,
        description: "ASIN (B09DFCB66S) or Amazon product link",
      },
      {
        name: "marketplace",
        type: "string",
        required: false,
        description:
          "Amazon store, e.g. com for amazon.com. A product link sets it on its own.",
        enum: [
          "com",
          "co.uk",
          "de",
          "fr",
          "it",
          "es",
          "ca",
          "co.jp",
          "com.br",
          "com.mx",
          "in",
        ],
        default: "com",
      },
      {
        name: "target_price",
        type: "number",
        required: false,
        description:
          "Email the owner when the price goes at or below this amount. null removes it.",
      },
      {
        name: "interval_minutes",
        type: "integer",
        required: false,
        description:
          "Minutes between two checks (1440 = daily). Checks faster than daily need a plan or a credit pack: every 60 minutes with a pack or Starter, 30 with Pro, 5 with Business.",
        default: 1440,
      },
      {
        name: "wait",
        type: "boolean",
        required: false,
        description: "Answer once the first check is done (up to 45 seconds)",
        default: false,
      },
    ],
  },
  {
    name: "update_product",
    title: "Change alerts and checks",
    path: "/products/{id}",
    methods: ["PATCH"],
    description:
      "Change alerts and checks. Target price, drop alerts, check interval, or pause. Send only what changes.",
    params: [
      {
        name: "id",
        type: "string",
        required: true,
        description: "product_id returned when the product was added",
      },
      {
        name: "target_price",
        type: "number",
        required: false,
        description:
          "Email the owner when the price goes at or below this amount. null removes it.",
      },
      {
        name: "interval_minutes",
        type: "integer",
        required: false,
        description:
          "Minutes between two checks (1440 = daily). Checks faster than daily need a plan or a credit pack: every 60 minutes with a pack or Starter, 30 with Pro, 5 with Business.",
        default: 1440,
      },
      {
        name: "alert_on_drop",
        type: "boolean",
        required: false,
        description:
          "Email when the price drops or the product is back in stock",
      },
      {
        name: "paused",
        type: "boolean",
        required: false,
        description: "Stop checking (and charging) for now; false resumes",
      },
    ],
  },
];
