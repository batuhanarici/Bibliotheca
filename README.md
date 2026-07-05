# Bibliotheca

Kişisel PDF kütüphaneniz için masaüstü uygulaması. Bilgisayarınızdaki kitap
PDF'lerini tarar, kategori ve raflara ayırır, uygulama içinden okumanızı
sağlar; okurken kaldığınız yeri hatırlar, not/yer imi eklemenize izin verir
ve kitap içeriğinde tam metin arama yapabilirsiniz.

## Özellikler

- **Klasör tarama** — belirttiğiniz klasördeki (ve alt klasörlerdeki) tüm
  PDF'leri otomatik bulur ve kütüphaneye ekler
- **Okuma** — pdf.js tabanlı görüntüleyici, sayfa gezinme, yakınlaştırma,
  kaldığınız yerden otomatik devam
- **Organizasyon** — kategori, yazar, raf/koleksiyon ataması, favoriler
- **Arama** — kitap adı/yazar bazlı hızlı arama ve PDF içeriğinde tam metin
  arama (FTS5)
- **Zenginleştirme** — otomatik kapak görseli çıkarma, sayfa bazlı not alma,
  yer imi, PDF'in kendi içindekiler (outline) yapısında gezinme
- **İstatistikler** — toplam kitap, favori, okunan sayfa, not/yer imi sayısı

## Teknoloji yığını

| Katman         | Teknoloji                          |
|----------------|-------------------------------------|
| Masaüstü kabuğu | Electron                           |
| Arayüz         | React 19 + TypeScript + Tailwind CSS |
| Build/Dev      | Vite + vite-plugin-electron         |
| Veritabanı     | SQLite (better-sqlite3), FTS5 tam metin arama |
| PDF render     | pdf.js (pdfjs-dist)                 |

Mimari, Electron'un `renderer` / `main process` ayrımına uyar: dosya sistemi
ve veritabanı erişimi yalnızca main process'te yapılır, renderer'a
`contextBridge` üzerinden güvenli bir `window.api` yüzeyi sunulur
(`contextIsolation: true`, `nodeIntegration: false`).

## Kurulum

Gereksinim: Node.js (18+)

```bash
npm install
```

## Geliştirme

```bash
npm run dev
```

Bu komut Vite dev sunucusunu ve Electron uygulamasını birlikte başlatır.

## Build

```bash
# Sadece web build (önizleme)
npm run build

# Windows/macOS/Linux için paketlenmiş masaüstü uygulaması
npm run build:desktop
```

Paketlenmiş çıktı `release/` klasöründe oluşur.

## Proje yapısı

```
electron/
  main.ts              → Electron ana süreç giriş noktası, pencere oluşturma
  preload.ts            → contextBridge ile renderer'a sunulan güvenli API
  db.ts                 → SQLite bağlantısı, şema ve migrasyon
  ipc-handlers.ts        → ipcMain.handle tanımları (dosya, veritabanı işlemleri)
src/
  App.tsx               → Ana uygulama durumu ve düzeni
  main.tsx              → React giriş noktası
  components/
    BookList.tsx / BookCard.tsx    → Kütüphane grid görünümü
    BookEditModal.tsx              → Kategori/yazar/raf düzenleme
    Sidebar.tsx                    → Raf, kategori, favori filtreleri
    SearchBar.tsx                  → Kitap adı/yazar hızlı arama
    FullTextSearchModal.tsx        → PDF içeriğinde tam metin arama
    PdfViewer.tsx / ViewerToolbar.tsx → Görüntüleyici ve araç çubuğu
    OutlinePanel.tsx / BookmarksPanel.tsx / NotesPanel.tsx → Görüntüleyici yan panelleri
    StatsModal.tsx                 → Okuma istatistikleri
  types/book.ts          → Paylaşılan TypeScript tipleri
```

## Veritabanı şeması

- `books` — id, title, file_path, added_at, last_page, is_favorite,
  category, author, cover_image, is_indexed
- `shelves` — id, name, created_at
- `book_shelves` — books ↔ shelves çoka-çok ilişki tablosu
- `bookmarks` — book_id, page_number, label
- `notes` — book_id, page_number, content
- `book_text` — FTS5 sanal tablosu, sayfa bazlı metin indeksi

Veritabanı dosyası kullanıcının `userData` klasöründe saklanır
(`app.getPath('userData')/database/bibliotheca.db`), proje klasörüne değil.

## Bilinen sınırlamalar

- Kitap kütüphaneden tamamen silinemiyor (yalnızca raftan çıkarılabiliyor)
- Diskten silinen/taşınan PDF'ler için otomatik tespit/temizlik yok
- Pencere için özel başlık çubuğu kontrolleri (kapat/simge durumuna
  küçült/büyüt) henüz eklenmedi

## Lisans

Kişisel kullanım için geliştirilmektedir.
