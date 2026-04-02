---
title: "Open Claude Code"
date: "2026-04-02"
lang: "tr"
summary: "31 Mart 2026'da bir npm kaynak haritası hatası sonucu sızan Claude Code kaynak kodunun üzerine inşa edilen openclaude projesi, proprietary AI araçlarını herkesin modeline açmanın ne anlama geldiğini ve sektörün buna nasıl tepki vereceğini gözler önüne seriyor."
---

## Giriş

31 Mart 2026, Anthropic'in takviminde büyük ihtimalle kırmızıyla işaretli bir tarih olarak kalacak. Claude Code'un o güne kadar kapalı tutulan kaynak kodu — 512.000 satır TypeScript, yaklaşık 1.900 dosya — bir `npm` paketi yayınlama hatasının kurbanı oldu ve saatler içinde internetin her köşesine yayıldı. Güvenlik araştırmacısı Chaofan Shou'nun X'te paylaştığı keşif, 28 milyonu aşkın görüntülemeye ulaştı. Repo'lar dakikalar içinde GitHub'a taşındı. DMCA talepleri geldi, ama artık iş işten geçmişti.

Ben de bu olayı hem teknik hem etik hem de stratejik bir lens üzerinden incelemeye çalıştım. Ve tam da bu atmosferde `openclaude` adlı bir proje ortaya çıktı: sızan kodu alıp herhangi bir `LLM`'e bağlayabilen bir shim katmanı. Durumun nasıl bir hal aldığını, bu projenin ne yaptığını ve sektörün buna nasıl tepki vereceğini adım adım açıklayayım.

## Sızıntı Nasıl Gerçekleşti?

Teknik açıklama oldukça sade: Anthropic, `v2.1.88` sürümünü `npm`'e yüklerken paketle birlikte bir `.map` dosyası da gönderdi. Source map dosyaları, minified kodla orijinal kaynak arasında köprü kurmak için kullanılan geliştirici araçlarıdır. Üretim paketine dahil edilmesi, teoride sadece bir konfigürasyon hatası — `.npmignore` ya da `package.json`'daki `files` alanında bir satır eksik.

04:23 UTC'de Chaofan Shou bu keşfi direkt indirme linki ile paylaştı ve 16 milyon kişi aynı anda thread'e aktı. En hızlı biçimde 50.000 yıldıza ulaşan repo bunu 2 saatten kısa sürede gerçekleştirdi, 41.500'den fazla fork oluştu.

Bunu daha da karmaşık hale getiren bir detay var: Claude Code'un kendisi `Bun` runtime üzerine inşa edilmiş, ve Bun'da 11 Mart'ta açılan bir bug, source map'lerin production modda bile sunulduğunu raporluyordu. Issue hâlâ açıktı. Yani tetikleyici bir insan hatası, ama altında yatan bir araç açığı.

Üstelik bu sızıntı yalnız gelmedi. Aynı gün, 00:21-03:29 UTC arasında, `axios` HTTP kütüphanesinin trojanize edilmiş versiyonları npm'e yüklendi ve içinde bir cross-platform remote access trojan barındırıyordu. İki olay birbirinden bağımsız, ama eş zamanlılık felaketi büyüttü.

## openclaude Nedir, Ne Yapar?

Sızıntının ardından GitHub'da `Gitlawb/openclaude` deposu ortaya çıktı. Projenin kendi tanımıyla: Claude Code'u yalnızca Claude modeliyle değil, `OpenAI`-uyumlu API konuşan her modelle çalıştırmayı mümkün kılan bir shim katmanı.

Teknik mimari oldukça temiz. Sadece 6 dosya değiştirilmiş, 786 satır eklenmiş, sıfır yeni bağımlılık eklenmemiş. Projenin kalbi `openaiShim.ts` adlı dosya; bu shim, Claude Code ile dış model arasında tam bir format çevirici olarak görev yapıyor:

- Anthropic mesaj bloklarını `OpenAI` mesaj formatına dönüştürüyor
- `tool_use` / `tool_result` bloklarını OpenAI function call yapısına çeviriyor
- OpenAI SSE streaming'i Anthropic stream eventlerine çeviriyor
- Anthropic sistem prompt dizilerini OpenAI sistem mesajlarına mapliyor

Kullanıcı tarafında ise son derece minimal. Üç ortam değişkeni yeterli: `CLAUDE_CODE_USE_OPENAI=1`, `OPENAI_API_KEY` ve `OPENAI_MODEL`. `DeepSeek`, `Gemini`, `Llama`, `Mistral`, `Ollama`, `LM Studio` — `OpenAI`-uyumlu API konuşan her endpoint çalışıyor. Hatta lokal modeller için API key bile gerekmiyor.

**Bu ne anlama geliyor?** Claude Code'un araç sistemi — `bash`, dosya okuma/yazma/düzenleme, `grep`, `glob`, çok-ajanlı iş akışları, `MCP` entegrasyonu — artık Anthropic'e bağlı değil. İstediğin modeli koyarsın, araç katmanı olduğu gibi çalışır.

## Sızan Kodun İçinden Ne Çıktı?

Kod yalnızca bir CLI wrapper değil; yıllar süren mühendislik çabasının ürünü ciddi bir altyapı. Analistler saatler içinde içeriği derinlemesine inceledi ve birkaç kritik bulgu öne çıktı.

**KAIROS:** Kaynak kodunda 150'den fazla kez geçen bu özellik, Claude Code'u her zaman açık çalışan, arka planda gözetleyen ve kullanıcı hareketsizken belleğini konsolide eden bir daemon moduna dönüştürüyor. Reactive bir asistan değil, sessizce izleyen ve gerektiğinde harekete geçen bir arka plan ajanı. 15 saniyelik bir blocking budget var — kullanıcı akışını kesmeyecek şekilde tasarlanmış.

**ULTRAPLAN:** Karmaşık planlama görevlerini uzak bir Cloud Container Runtime oturumuna devreden, Opus 4.6'yı 30 dakikaya kadar çalıştıran ve kullanıcının sonucu tarayıcı üzerinden onaylamasına olanak tanıyan bir mod. Onay verilince sonuç `__ULTRAPLAN_TELEPORT_LOCAL__` adlı bir sentinel değerle yerel terminale aktarılıyor.

**Undercover Mode:** Anthropic'in Claude Code'u kamuya açık `open-source` repolara katkı yaparken tüm iç izlerini silen bir mod. Sistem promptu açıkça şunu söylüyor: koda adname, Slack kanalı, repo adı veya "Claude Code" ifadesi koyma. Ve üstelik bu modun zorla kapatılması mümkün değil — `"There is NO force-OFF"`.

**Anti-distillation:** Kod, rakip şirketlerin Claude Code çıktılarını kendi modellerini eğitmek için kazımasını engellemek amacıyla API yanıtlarına sahte araç tanımları enjekte eden kontroller içeriyor.

Temel model sızmadı — eğitim verisi, model ağırlıkları, core intelligence hiçbiri açığa çıkmadı. Bu, Claude Code'un modelin üzerine inşa edilmiş CLI wrapper'ıydı. Kullanıcı verisi risk altında değil. Ama ürün yol haritası artık herkese açık.

## Doğurabileceği Sonuçlar

Bu olayı sadece bir güvenlik vakası olarak okumak yetersiz. Birkaç farklı boyutu var.

### Rekabetçi avantaj kaybı

Asıl hasar kodun kendisi değil, özellik flag'leri. KAIROS, anti-distillation mekanizmaları — bunlar rakiplerin artık görebildiği ve tepki verebildiği ürün yol haritası detayları. Kod yeniden yazılabilir, ama stratejik sürpriz geri alınamaz.

`openclaude` tam da bu açığı istismar ediyor: Anthropic'in yıllarca geliştirdiği araç katmanı artık herhangi bir modele bağlanabiliyor. Bu, küçük ekiplerin ya da rakiplerin benzer bir agentic altyapıyı sıfırdan kurmak yerine sızan kodu baz alarak kendi üretimleri için kullanabileceği anlamına geliyor.

### Supply chain riski

Sızıntıyla eş zamanlı gerçekleşen `axios` supply chain saldırısı, bu tür kazaların nasıl çok katmanlı tehdit ortamları yaratabileceğini gösteriyor. Typosquatting saldırıları da başladı; sızan kodu derlemeye çalışanlar sahte bağımlılıklar aracılığıyla hedef alındı.

### Etik ve şeffaflık soruları

Undercover Mode'un ortaya çıkması, yapay zeka şeffaflığı tartışmasını somut bir case üzerine taşıdı. Bir AI aracı, katkıda bulunduğu `open-source` repoya AI olduğunu açıklamak zorunda mı? Mevcut cevap hayır — hukuki ya da etik bir zorunluluk yok. Ama bu sorunun yanıtlanmaya devam edeceği açık.

### Anthropic'in operasyonel güvenilirliği

Anthropic, "dikkatli olan şirketiz" markasını taşıyor. İki sızıntının beş gün içinde gerçekleşmesi, bu markanın operasyonel karşılığını sorgulatıyor. Model seviyesinde güvenlik ilkeleri ne kadar olgun olursa olsun, release pipeline hatalarının marka değerine zararı gerçek.

## Sektörün Yönelimi

Bu olayın ardından birkaç eğilim belirginleşiyor.

**Build pipeline güvenliği gündeme geldi.** `npm pack --dry-run` artık pek çok ekibin zorunlu adımı haline geldi. `.map` dosyalarının `npmignore`'a alınması, source map generation'ın production build'lerde kapatılması — basit ama kritik adımlar. Bu sızıntı, "güvenlik açıkları her zaman karmaşık değildir" dersinin en çarpıcı örneklerinden biri.

**OpenAI-compatible API katmanı fiili standart haline geliyor.** `openclaude`'un altı dosya ve 786 satırla Claude Code'u herhangi bir modele açabilmesi, OpenAI'nin API formatının ne kadar güçlü bir ekosistem standardı haline geldiğini gösteriyor. Gelecekteki agentic araçların bu formatı desteklememesi giderek imkânsız hale geliyor.

**Proprietary agentic altyapının gizli kalması zorlaşıyor.** Anthropic'in durumu bir ders niteliğinde: CLI araçları, tarayıcı uzantıları ve npm paketleri gibi dağıtık deployment modelleri, model ağırlıklarının aksine çok daha kırılgan gizlilik sınırlarına sahip. Agentic araçlar üretimdeyse, kaynak kodunun bir şekilde gün yüzüne çıkma riski her zaman var.

**Anthropic'in kendi hamlesi bekleniyor.** Topluluk şimdi bir şeyi biliyor: KAIROS, ULTRAPLAN ve Coordinator Mode sadece kavram değil, gerçek kodlar. Bu koşullar altında Anthropic'in bu özellikleri hızlandırılmış bir takvimde duyurması olası. Bazen sızıntı, en iyi pazarlama bütçesinden daha etkili olabiliyor.

## Sonuç

`openclaude` tek başına bir yazılım projesi değil; Claude Code sızıntısının en somut ve pratik çıktısı. Altı dosya değiştirerek Anthropic'in araç katmanını herhangi bir modele bağlayan bu shim, proprietary agentic altyapının gizliliğinin ne kadar kırılgan olduğunu kanıtlıyor. Sızıntı bir konfigürasyon hatasıyla başladı, ama sonuçları çok daha geniş: ürün yol haritası açığa çıktı, rekabet dinamikleri değişti, supply chain riskleri görünür hale geldi ve yapay zeka şeffaflığı tartışması yeni bir boyut kazandı. Ekiplerin bundan alması gereken ders nettir — release pipeline güvenliği, model güvenliği kadar kritiktir.
