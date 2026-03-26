---
title: "Purdue Modeli Öldü mü?"
date: "2026-03-26"
lang: "tr"
summary: "Klasik Purdue modeli IIoT çağında hâlâ geçerli mi, yoksa modern OT ağ mimarisinin gerçekleri bu katmanlı yapıyı fiilen çökertti mi?"
---

## Giriş

Birkaç ay önce bir OSIsoft PI Server kurulumunu incelerken fark ettim: `Level 2` ile `Level 3` arasında olması gereken o net sınır yoktu. Mühendislik iş istasyonu doğrudan bulut entegrasyon katmanıyla konuşuyor, `OPC-UA` trafiği firewall üzerinden değil, açık bir `NAT` kuralıyla geçiyordu. Klasik Purdue modelini bilen biri için bu tablo neredeyse felaketti. Ama o sistemin sahibi olan otomasyon mühendisi bana sadece omuz silkip şunu söyledi: "Üretim durmadıkça kimse bir şey sormadı."

Bu cümle aslında her şeyi özetliyor.

Purdue Referans Modeli, 1990'larda Theodore Williams tarafından geliştirildi ve ICS/OT ağ mimarisinin neredeyse kutsal metni hâline geldi. `Level 0`'dan `Level 4`'e uzanan katmanlar; saha cihazları, kontrolörler, SCADA, üretim yönetimi ve kurumsal ağ arasında net ayrımlar çiziyordu. `DMZ` kavramı, `air gap` ideali, güvenlik bölgeleri — hepsi bu modelin üzerine inşa edildi. Onlarca yıl boyunca işe de yaradı.

Ama IIoT bunu değiştirdi. Ve değiştirdiği şeyin boyutunu tam olarak kavramak, bugün OT güvenliği üzerine çalışan biri olarak benim için oldukça kritik.

## Purdue'nun Vaadi ve Sınırı

Modelin çekiciliği basitti: **ağı katmanlara böl, her katmanı izole et, aralarındaki trafiği minimize et.** Bu yaklaşım, OT ağlarının geleneksel yapısına mükemmel oturuyordu. Kapalı sistemler, özel protokoller (`Modbus`, `DNP3`, `PROFINET`), onlarca yıl değişmeyen döngüler. Bir PLC'nin internete ihtiyacı yoktu, bir RTU'nun bulut bağlantısına da.

Sorun şu ki bu varsayımların hepsi yanlış çıktı.

Bugün bir üretim tesisine gittiğinizde `Level 1`'deki bir sensörün doğrudan Azure IoT Hub'a veri gönderdiğini görmek artık sıradışı değil. `Level 3`'te olması beklenen bir `Historian` sunucusu, `Level 0`'daki cihazlardan gerçek zamanlı veri çekiyor ve bunu aynı anda SAP gibi kurumsal sistemlerle paylaşıyor. Katmanlar teoride var, pratikte değil.

Bu durumu kaçınılmaz kılan birkaç dinamik var.

### IIoT'nin Getirdiği Basınç

Üretim verimliliği artık veri analitiğine bağlı. Bir fabrika hattının `OEE` (Overall Equipment Effectiveness) metriklerini hesaplamak istiyorsanız, o verinin buluta çıkması gerekiyor — ve çoğu zaman mümkün olan en kısa yoldan. Purdue modeli bu ihtiyacı barındırmak için tasarlanmamıştı.

`MQTT`, `AMQP`, `OPC-UA over HTTPS` gibi protokoller artık doğrudan saha katmanından kurumsal ve bulut katmanlarına köprü kuruyor. Bu köprüler güvenli olabilir; ama her kurulumda öyle olmadığı kesin.

Dahası, uzaktan erişim ihtiyacı pandemiyle birlikte patlama yaptı. Bakım mühendisi artık sahaya gitmeden `VPN` üzerinden PLC'ye bağlanmak istiyor. Bu ihtiyaç meşru, ama Purdue modelinin `air gap` anlayışıyla doğrudan çelişiyor.

### Firewall Stratejilerinin Gerçekçi Durumu

Teoride her katman arasına bir `next-generation firewall` koyarsınız, `IDS/IPS` çalıştırırsınız, trafiği whitelist bazlı yönetirsiniz. Pratikte?

Çoğu OT ortamında firewall kuralları ya çok geniş (`any-any`) ya da o kadar eski ki kim yazdı kimse bilmiyor. Bir `Purdue Level 3` ile `Level 4` arasındaki firewall'u audit ettiğinizde onlarca açık port, birkaç yıldır kimsenin dokunmadığı devre dışı `ACL`'ler ve "üretimi kesmemek için" eklenmiş geçici kurallar buluyorsunuz.

**Asıl sorun kural sayısı değil, değişim yönetiminin yokluğu.** OT ortamlarında firewall kuralı eklemenin "acil değişiklik" prosedürüyle geçtiği ve sonra unutulduğu bir döngü var. Bu döngü kırılmadan salt katman mimarisi bir güvenlik illüzyonundan ibaret.

Ayrıca `OT-spesifik protokoller` için derin paket incelemesi yapabilen firewall sayısı hâlâ sınırlı. `Modbus TCP` ya da `EtherNet/IP` trafiğini anlamlandırabilen bir `NGFW` pahalı ve yaygın değil. Bu boşlukta birçok organizasyon `port-based` filtrelemeyle yetiniyor — ki bu 2026'da yeterli değil.

## Yeni Nesil Mimari: Purdue'nun Ötesi

Purdue modelinin yerine geçmek üzere önerilen birkaç yaklaşım var. `IEC 62443` standardı organizasyonları katman yerine **güvenlik bölgelerine** (`zones`) ve bu bölgeler arasındaki **kanallar** (`conduits`) üzerinden yönetmeye yönlendiriyor. Bu yaklaşım Purdue'ya göre daha esnek çünkü fiziksel katman mantığı yerine varlık gruplandırması ve iletişim ihtiyacı bazlı bir model sunuyor.

`Zero Trust` mimarisi de OT dünyasına taşınmaya çalışılıyor. "Ağın içinde olman seni güvenilir yapmaz" ilkesi ICS bağlamında anlamlı, ama uygulaması zor. `SCADA` sistemlerinde her oturumu doğrulayan, cihaz kimliğini sürekli kontrol eden bir altyapı kurmak hem teknik hem operasyonel olarak ciddi bir meydan okuma.

`Micro-segmentation` bu bağlamda daha pratik bir çözüm gibi görünüyor. Tüm OT ağını tek bir Purdue katmanına göre bölmek yerine, **fonksiyonel iş birimi bazında** küçük ağ segmentleri oluşturmak ve aralarındaki trafiği en aza indirmek. `Claroty`, `Dragos`, `Nozomi Networks` gibi `OT-native` güvenlik çözümleri bu segmentasyonu `passive discovery` ile destekliyor — yani üretimi durdurmadan ağdaki tüm varlıkları ve iletişim örüntülerini görünür kılıyor.

### Bulut Bağlantısı ve DMZ'nin Yeniden Tanımı

Modern OT-IT entegrasyonunda `DMZ` kavramı evrim geçiriyor. Tek bir ara katman yerine, artık çok katmanlı veri diyotları (`data diodes`), `unidirectional gateways` ve protokol dönüştürücüler kullanılıyor. `Waterfall Security` ya da `Owl Cyber Defense` gibi çözümler veriyi yalnızca tek yönde ileterek teorik `air gap`'e en yakın güvenli köprüyü kuruyor.

Bulut tarafında ise `Azure Defender for IoT` (eski adıyla CyberX) ya da `AWS IoT Greengrass` gibi platformlar saha ile bulut arasındaki güvenli veri kanallarını yönetiyor. Ama bu platformların doğru konfigüre edilmesi ve izlenmesi başlı başına bir uzmanlık gerektiriyor.

## Pratikteki Yansımalar

Şunu net söyleyeyim: Purdue modeli ölmedi. Ama artık tek başına yeterli bir mimari çerçeve de değil.

Katmanlar hâlâ bir organizasyon ve dokümantasyon aracı olarak işe yarıyor. Bir sistemin hangi katmanda olduğunu bilmek, risk değerlendirmesi ve `segmentation` planlaması için iyi bir başlangıç noktası. Ama bu katmanları gerçek bir güvenlik sınırı olarak görmek yanıltıcı.

Bugün bir OT ağını güvenli hâle getirmeye çalışıyorsanız şu soruları sormanız gerekiyor: Katmanlar arasındaki gerçek trafik akışlarını biliyor musunuz? Firewall kurallarınız düzenli audit ediliyor mu? `IIoT` cihazlarınızın bağlantı profilleri tanımlı ve izleniyor mu? `Incident response` planınız OT ortamının tolerans seviyelerini hesaba katıyor mu?

Bunların cevapları "hayır"sa, Purdue modelini ne kadar mükemmel çizerseniz çizin, güvenlik açısından kağıt üzerinde kalırsınız.

## Sonuç

Purdue modeli, ICS/OT güvenliğinin dilini şekillendirdi ve bu miras hâlâ değerli. Ama IIoT, bulut entegrasyonu ve uzaktan erişim ihtiyaçları bu modelin varsayımlarını fiilen geçersiz kıldı. Modern OT güvenlik mimarisi; `IEC 62443` bölge mantığını, `Zero Trust` prensiplerini, `OT-native` görünürlük araçlarını ve gerçekçi firewall yönetimini bir arada düşünmek zorunda. Katmanları çizmek yetmiyor — o katmanlar arasında gerçekte ne geçtiğini anlamak gerekiyor.
