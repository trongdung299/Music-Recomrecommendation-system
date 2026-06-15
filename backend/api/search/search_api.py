import re
from typing import List, Optional
# Link ảnh giả lập đĩa nhạc đĩa than (Vinyl) cực nghệ thuật để thay thế khi DB thiếu ảnh
DEFAULT_MOCK_IMAGE = "https://images.unsplash.com/photo-1539628399213-d6aa89c93074?w=150&auto=format&fit=crop&q=60"

def remove_accents(text: str) -> str:
    accents_regex = {
        'a': r'[àáạảãâầấậẩẫăằắặẳẵ]', 'e': r'[èéẹẻẽêềếệểễ]', 'i': r'[ìíịỉĩ]',
        'o': r'[òóọỏõôồốộổỗơờớợởỡ]', 'u': r'[ùúụủũưừứựửữ]', 'y': r'[ỳýỵỷỹ]',
        'd': r'[đ]'
    }
    text = str(text).lower().strip()
    for char, regex in accents_regex.items():
        text = re.sub(regex, char, text)
    return text

def convert_ms_to_minutes(ms: Optional[int]) -> str:
    if ms is None or ms <= 0:
        return "3:45"
    seconds = int((ms / 1000) % 60)
    minutes = int((ms / (1000 * 60)) % 60)
    return f"{minutes}:{seconds:02d}"

def get_lyric_snippet(lyric: str, query: str, length: int = 120) -> str:
    if not lyric: 
        return "Bài hát này nằm ngoài danh mục 51k bài (Không có sẵn lyric văn bản)."
    
    query_clean = remove_accents(query)
    lyric_clean = remove_accents(lyric)
    
    idx = lyric_clean.find(query_clean)
    if idx != -1:
        start = max(0, idx - 40)
        end = min(len(lyric), idx + length)
        snippet = lyric[start:end].replace('\n', ' ')
        return f"...{snippet.strip()}..."
    
    return str(lyric)[:length].replace('\n', ' ') + "..."

def validate_image_url(url: Optional[str]) -> str:
    if not url or url.strip() == "" or url == "None" or not str(url).startswith("http"):
        return DEFAULT_MOCK_IMAGE
    return str(url).strip()

