import './style.css'
export default function SearchPage()
{
    return(
        <div class="container">
        <div class="header">
            <h1>Music Hybrid Search</h1>
            <p>Information Retrieval| Kiến trúc Lai: Từ khóa & Học sâu Ngữ nghĩa Transformer</p>
        </div>

        <div class="tabs-container">
            <button class="tab-btn active" data-type="all">
                <i class="fa-solid fa-layer-group"></i> Tìm tất cả
            </button>
            <button class="tab-btn" data-type="name">
                <i class="fa-solid fa-music"></i> Tìm theo tên bài / Ca sĩ
            </button>
            <button class="tab-btn" data-type="lyric">
                <i class="fa-solid fa-file-lines"></i> Tìm theo lời bài hát
            </button>
        </div>

        <div class="search-wrapper">
            <input type="text" id="searchInput" class="search-input" placeholder="Nhập tên bài hát, nghệ sĩ hoặc câu lời nhạc bạn nhớ được..."/>
            <button id="searchBtn" class="search-submit-btn">
                <i class="fa-solid fa-magnifying-glass"></i> Tìm kiếm
            </button>
        </div>

        <div id="statusMessage" class="status-message"></div>
        <div id="resultsList" class="results-list"></div>
    </div>
    )
}