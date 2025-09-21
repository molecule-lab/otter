CREATE TABLE "knowledge_chunks" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"knowledge_item_id" text NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_embeddings" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"knowledge_chunk_id" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"token_count" numeric NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_items" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"source_id" text NOT NULL,
	"knowledge_job_id" text,
	"chunks_count" numeric NOT NULL,
	"chunk_size" numeric NOT NULL,
	"chunk_overlap" numeric NOT NULL,
	"splitter" text,
	"embedding_model" text NOT NULL,
	"embedding_provider" text NOT NULL,
	"total_tokens" numeric NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_query" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"api_key_id" text NOT NULL,
	"query_text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_query_result" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"knowledge_query_id" text NOT NULL,
	"knowledge_chunk_id" text NOT NULL,
	"score" double precision NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "knowledge_jobs" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "knowledge_jobs" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "knowledge_jobs" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "knowledge_jobs" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "sources" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "sources" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "sources" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "sources" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_knowledge_item_id_knowledge_items_id_fk" FOREIGN KEY ("knowledge_item_id") REFERENCES "public"."knowledge_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_embeddings" ADD CONSTRAINT "knowledge_embeddings_knowledge_chunk_id_knowledge_chunks_id_fk" FOREIGN KEY ("knowledge_chunk_id") REFERENCES "public"."knowledge_chunks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_items" ADD CONSTRAINT "knowledge_items_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_items" ADD CONSTRAINT "knowledge_items_knowledge_job_id_knowledge_jobs_id_fk" FOREIGN KEY ("knowledge_job_id") REFERENCES "public"."knowledge_jobs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_query" ADD CONSTRAINT "knowledge_query_api_key_id_apikey_id_fk" FOREIGN KEY ("api_key_id") REFERENCES "public"."apikey"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_query_result" ADD CONSTRAINT "knowledge_query_result_knowledge_query_id_knowledge_query_id_fk" FOREIGN KEY ("knowledge_query_id") REFERENCES "public"."knowledge_query"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_query_result" ADD CONSTRAINT "knowledge_query_result_knowledge_chunk_id_knowledge_chunks_id_fk" FOREIGN KEY ("knowledge_chunk_id") REFERENCES "public"."knowledge_chunks"("id") ON DELETE cascade ON UPDATE no action;