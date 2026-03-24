---
title: "IT vs. OT: Neden Aynı Kurallar İşlemiyor?"
date: "2026-03-24"
lang: "tr"
summary: "Ofis ağları ile endüstriyel sistemlerin temel mimari ve öncelik farklarını keşfediyoruz."
---

## Giriş

Siber güvenlik denilince çoğu zaman aklımıza veri ihlalleri, fidye yazılımları ya da sızdırılan kimlik bilgileri gelir. Bu çerçeve kurumsal IT dünyası için nispeten doğru olabilir. Ancak bir endüstriyel tesis düşünün: bir petrokimya rafinerisi, bir nükleer santral, bir su arıtma istasyonu. Bu ortamlarda bir güvenlik açığının bedeli bir veri kaybıyla ölçülmez. Bedelini insanlar öder.

Son yıllarda OT (Operational Technology) ve IT ağlarının birbirine yakınsamasıyla birlikte bu tesislerde siber tehdit yüzeyi dramatik biçimde genişledi. Ben de bilgisayar mühendisliği eğitimimin son yılında, özellikle ICS/OT siber güvenliği üzerine yoğunlaşırken şu soruyla yüzleştim: **Fiziksel emniyet, dijital güvenlik olmadan gerçekten mümkün mü?** Bu yazıda bu soruya hem teknik hem de felsefi bir perspektiften yanıt arıyorum.

## SIS Nedir ve Neden Kritiktir?

`SIS` (Safety Instrumented System), endüstriyel süreçlerde tehlikeli durumların önüne geçmek için tasarlanmış bağımsız bir güvenlik katmanıdır. Bir reaktördeki basınç eşiği aşıldığında otomatik olarak devreye giren sistem, bir kimyasal tankın taşmasını önleyen acil kapatma mekanizması ya da bir gaz sızıntısını algılayıp tesisi emniyetli bir duruma getiren kontrol zinciri — bunların hepsi `SIS` kapsamındadır.

`IEC 61511` standardı, bu sistemleri `SIL` (Safety Integrity Level) adı verilen seviyelere göre sınıflandırır. `SIL 1`'den `SIL 4`'e uzanan bu skala, bir güvenlik fonksiyonunun ne kadar güvenilir olduğunu tanımlar. Geleneksel mühendislik anlayışında `SIS`, fiziksel süreçlerden ve kontrol sistemlerinden (`BPCS` — Basic Process Control System) tamamen izole edilmiş kabul edilirdi. Fikir basitti: izolasyon, koruma demektir.

Ama bu fikir artık geçerliliğini yitiriyor.

## Convergence: İki Dünyanın Tehlikeli Yakınlaşması

Modernleşme baskısı, maliyet optimizasyonu ve uzaktan izleme ihtiyacı; OT sistemlerini giderek daha fazla IT altyapısına bağlamaya zorluyor. Eskiden hava boşluğuyla (`air-gap`) korunan sistemler artık kurumsal ağlara, bulut platformlarına ve uzaktan erişim çözümlerine entegre ediliyor.

Bu `convergence` (yakınsama) süreci verimliliği artırıyor, ancak beraberinde köklü bir mimari çelişki getiriyor: IT güvenliğinin temel öncelikleri **gizlilik, bütünlük ve erişilebilirlik** (`CIA triad`) iken, OT güvenliğinde bu öncelikler tersine dönüyor. Bir endüstriyel sistemde **erişilebilirlik ve bütünlük** ön plandadır; bir güvenlik yamalaması için sistemi durdurmak mümkün olmayabilir, çünkü durmak demek tehlike demektir.

`SIS` katmanı da bu yakınsamadan nasibini alıyor. Pek çok modern `SIS`, artık `OPC UA` veya `Modbus TCP` gibi endüstriyel protokollerle kurumsal ağlara veri gönderiyor. Bu bağlantılar, denetim ve raporlama için değerlidir; ancak aynı zamanda saldırı yüzeyi oluşturur.

## Triton/TRISIS: Bir Kâbus Senaryosu

2017 yılında Orta Doğu'daki bir petrokimya tesisinde keşfedilen `TRITON` (ya da `TRISIS`) zararlı yazılımı, siber güvenlik tarihinin en ürkütücü örneklerinden biridir. Bu kötü amaçlı yazılım doğrudan `Triconex` marka `SIS` donanımını hedef almış; güvenlik katmanını devre dışı bırakmaya çalışmıştır.

Saldırganların amacı verileri çalmak değildi. Amaç, güvenlik sistemini etkisiz kılarak fiziksel bir felakete zemin hazırlamaktı. Bir programlama hatası nedeniyle sistemler `safe state`'e geçti ve tesis beklenmedik biçimde kapandı — bu sayede büyük bir felaket önlendi. Ama tasarlanan şey bir veri ihlali değil, patlamaydı.

Bu olay bana şunu net biçimde gösterdi: **Siber güvenlik, bir noktada insanların fiziksel güvenliğiyle örtüşüyor.** `SIS` artık yalnızca bir mühendislik katmanı değil, bir savunma hattı.

## Defense-in-Depth: Katmanlı Güvenlik Mimarisi

Peki bu tehdide karşı nasıl bir mimari inşa edilmeli? Endüstriyel güvenlikte en olgun yaklaşım `defense-in-depth` modelidir. Bu model, tek bir güvenlik önlemine güvenmek yerine katmanlı bir savunma anlayışını benimser.

`IEC 62443` standardı bu modeli OT bağlamında çerçeveler. Ağ segmentasyonu, `DMZ` (Demilitarized Zone) kullanımı, güvenli uzaktan erişim protokolleri (`VPN`, `jump server`) ve `SIS` ile `BPCS` arasındaki sıkı ayrım bu mimarinin temel bileşenleridir.

Özellikle şu prensipler kritik önem taşır:

### Ağ Segmentasyonu ve Zone Modeli

`ISA/IEC 62443`'ün önerdiği zone-conduit modeli, endüstriyel ağı güven seviyelerine göre bölgelere ayırır. `SIS`, mümkün olan en kısıtlı zone içinde konumlandırılmalı; bu zone'a erişim yalnızca zorunlu kondüitler üzerinden ve sıkı denetimle sağlanmalıdır.

### Güvenli Yazılım Geliştirme ve Firmware Bütünlüğü

`SIS` donanımlarındaki `firmware` güncellemeleri, doğrulanmış kanallar üzerinden yapılmalı ve imza doğrulaması zorunlu tutulmalıdır. `TRITON` saldırısında saldırganlar `TriStation` protokolünü tersine mühendislikle çözümleyerek `SIS` kontrolörlerine kötü amaçlı kod yükleyebildi. Bu, tedarik zinciri güvenliğinin ne kadar kritik olduğunu gözler önüne seriyor.

### Anomali Tespiti ve OT-Spesifik Monitoring

Klasik `IDS` (Intrusion Detection System) çözümleri OT ortamlarında yetersiz kalır, çünkü endüstriyel protokolleri anlamazlar. `Claroty`, `Dragos` veya `Nozomi Networks` gibi OT-spesifik güvenlik platformları, `Modbus`, `DNP3`, `EtherNet/IP` gibi protokolleri anlayarak anormal davranışları tespit edebilir.

## Güvenlik mü, Emniyet mi? Disiplinlerin Felsefi Yakınlaşması

İngilizce'de `security` ve `safety` ayrı kavramlardır. Türkçe'de her ikisi de çoğu zaman "güvenlik" olarak çevrilir — bu bir eksiklik değil, belki de bir gerçekliğin dile yansımasıdır.

`Safety`, kazalara karşı korumayı ifade eder; kasıtsız arızalar, insan hataları, süreç sapmaları. `Security` ise kasıtlı, kötü niyetli tehditlere karşı korumayı. Geleneksel olarak bu iki alan ayrı mühendislik disiplinleri tarafından ele alınırdı. Güvenlik mühendisleri `HAZOP` (Hazard and Operability Study) gibi araçlarla çalışırken, siber güvenlik mühendisleri tehdit modelleme ve sızma testleriyle ilgilenirdi.

Ama `TRITON` gibi saldırılar bize şunu gösterdi: **Kasıtlı bir siber saldırı, kasıtsız bir süreç arızasıyla aynı fiziksel sonucu doğurabilir.** Bu nedenle `SIS` tasarımı artık siber tehditleri de kapsayan bir tehdit modeli gerektiriyor. `IEC 61511`'in 2016 revizyonu bu gerçeği kabul ederek `cyber security risk assessment`'ı `safety lifecycle`'ın bir parçası hâline getirdi.

Bu felsefi yakınlaşma bence son derece önemli. Artık bir `SIS` mühendisi siber tehditleri bilmeden eksik kalıyor; bir OT güvenlik uzmanı da süreç güvenliğini anlamadan yetersiz.

## Yapay Zeka ve Geleceğin Tehditleri

Kariyerimi hem ICS/OT güvenliği hem de yapay zeka güvenliği üzerine şekillendirmeye çalışırken şunu fark ettim: bu iki alan giderek birbirine yaklaşıyor. Endüstriyel sistemlere entegre edilen `ML` tabanlı anomali tespit motorları yeni bir saldırı yüzeyi oluşturuyor. Bir saldırgan, modeli aldatacak şekilde tasarlanmış `adversarial` girdilerle güvenlik sistemini kör edebilir.

Henüz bu tehdidin gerçek dünya örneklerini çok az gördük; ancak OT ortamlarında yapay zeka kullanımı yaygınlaştıkça bu risk de büyüyecek. **Güvenli yapay zeka** ile **güvenli endüstriyel sistemler** artık ayrı konular değil.

---

Fiziksel emniyet, dijital güvenlik olmadan mümkün değil — en azından birbirine bağlı sistemlerin hâkim olduğu modern endüstriyel dünyada. `SIS` bir varoluş nedeniyle tasarlanmıştır: işler ters gittiğinde insanları korumak. Ama bu koruma katmanı kendisi savunmasız hâle gelirse, tüm mimari çöker. Sormaya devam etmemiz gereken soru şu: Güvenlik mühendisleri ve siber güvenlik uzmanları gerçekten aynı dili konuşuyor mu?
