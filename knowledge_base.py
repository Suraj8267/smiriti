import os

def load_knowledge_base():
    chunks = []
    data_folder = "data"
    if not os.path.exists(data_folder):
        return []
    for filename in os.listdir(data_folder):
        if filename.endswith(".txt"):
            with open(f"{data_folder}/{filename}", "r", encoding="utf-8") as f:
                content = f.read()
                sections = content.split("\n\n")
                chunks.extend([s.strip() for s in sections if s.strip()])
    return chunks

def search_knowledge(query, index, chunks, top_k=3):
    if not chunks:
        return ""
    query_words = query.lower().split()
    scored = []
    for chunk in chunks:
        chunk_lower = chunk.lower()
        score = sum(1 for word in query_words if word in chunk_lower)
        if score > 0:
            scored.append((score, chunk))
    scored.sort(reverse=True)
    top = [chunk for _, chunk in scored[:top_k]]
    return "\n\n".join(top)

print("📚 Knowledge base load ho raha hai...")
CHUNKS = load_knowledge_base()
INDEX = None
print(f"✅ {len(CHUNKS)} chunks loaded!")