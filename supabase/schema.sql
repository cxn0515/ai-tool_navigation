create table if not exists tool_categories (
  id bigserial primary key,
  slug varchar(64) not null unique,
  name varchar(80) not null,
  description varchar(400) not null,
  icon varchar(40) not null,
  sort_order integer not null default 0
);

create table if not exists ai_tools (
  id bigserial primary key,
  slug varchar(80) not null unique,
  name varchar(120) not null,
  description varchar(600) not null,
  url varchar(500) not null,
  icon_url varchar(500) not null,
  pricing varchar(80) not null,
  featured boolean not null default false,
  domestic boolean not null default false,
  sort_order integer not null default 0,
  category_id bigint not null references tool_categories(id)
);

create table if not exists ai_tool_tags (
  tool_id bigint not null references ai_tools(id) on delete cascade,
  tag_order integer not null,
  tag varchar(40) not null,
  primary key (tool_id, tag_order)
);

create index if not exists idx_ai_tools_category_id on ai_tools(category_id);
create index if not exists idx_ai_tools_featured on ai_tools(featured);
create index if not exists idx_ai_tools_domestic on ai_tools(domestic);
create index if not exists idx_ai_tools_sort_order on ai_tools(sort_order);

comment on table tool_categories is 'AI tool navigation categories';
comment on table ai_tools is 'AI tool directory entries';
comment on table ai_tool_tags is 'Ordered tags for AI tools';
