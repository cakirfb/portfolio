\---

## title: "IT vs. OT: Neden Aynı Kurallar İşlemiyor?"


date: "2026-03-24"
lang: "tr"
summary: "Ofis ağları ile endüstriyel sistemlerin temel mimari ve öncelik farklarını keşfediyoruz."
---

## Giriş

Bilgisayar mühendisliği son sınıf öğrencisi olarak endüstriyel kontrol sistemleri (ICS) ve OT güvenliği üzerine çalışırken fark ettiğim en çarpıcı şey şu: IT ve OT dünyaları aynı dili konuşmuyor. Ofiste çalışan bir sunucuyla fabrikadaki bir PLC'yi aynı güvenlik politikalarıyla yönetmeye çalışmak, balık tutma oltasıyla vinç kullanmaya benziyor. İkisi de "kaldırma" işi yapıyor ama yaklaşımlar tamamen farklı.

Bu yazıda, IT (Information Technology) ve OT (Operational Technology) sistemlerinin neden farklı önceliklere sahip olduğunu ve bu farkın siber güvenlik stratejilerine nasıl yansıdığını inceleyeceğim.

## CIA vs. Başka Bir CIA

IT dünyasında güvenliğin temel ilkeleri CIA Triad ile özetlenir: Confidentiality (gizlilik), Integrity (bütünlük), Availability (erişilebilirlik). Bu sıralama tesadüf değil. Ofis ağlarında en kritik varlık veridir ve bu verinin gizliliği her şeyden önemlidir.

OT dünyasında ise öncelikler tam tersi sıralanır: Availability, Integrity, Confidentiality. Bir petrokimya tesisinde reaktörü kontrol eden sistemin 7/24 çalışması gerekir. O sistemin verilerinin şifrelenmesi önemlidir ama önce durmaması gerekir. Bir güvenlik yaması uygulamak için üretimi durdurmak, günde yüzbinlerce dolarlık kayıp demektir.

## Yama Yönetimi

IT departmanlarında yama yönetimi rutin bir iştir. Salı günü Microsoft yamaları gelir, sistemler yeniden başlatılır, hayat devam eder. Kullanıcılar birkaç dakika bekler, kimse ölmez.

OT dünyasında ise bir SCADA sistemine yama uygulamak tam bir operasyondur:



* Üretim durur (yılda 2-3 planlı bakım penceresi varsa şanslısınız)
* Yama, 15-20 yıllık eski donanımla uyumlu mu test edilir
* Risk değerlendirmesi yapılır: Yama riskli mi, yoksa yamamamak mı daha riskli?
* Bir şeyler ters giderse yedek sistemler hazır mı kontrol edilir

Birçok endüstriyel tesiste Windows XP veya Windows 7 çalıştıran sistemler hâlâ aktif. Neden? Çünkü o sistemler çalışıyor ve değiştirmenin maliyeti çok yüksek. IT perspektifinden bakınca delilik gibi görünür ama OT perspektifinden bakınca mantıklıdır: eğer bir sistem izole edilmiş ve saldırı yüzeyi minimize edilmişse, eski işletim sistemi düşündüğünüz kadar büyük bir risk olmayabilir.

## Uptime Yetersizliği 

IT sistemlerinde %99.9 uptime iyi bir hedeftir. Yılda 8.76 saat kesinti kabul edilebilir sayılır. Email sunucunuz birkaç saat çökerse, kullanıcılar şikayet eder ama dünya dönmeye devam eder.

OT sistemlerinde ise %99.99+ beklenir. Bazı kritik altyapılarda (enerji, su arıtma, petrokimya) hedef %99.999 veya daha iyisidir. Çünkü bir saat kesinti, sadece para kaybı değil, insan hayatını veya çevreyi tehlikeye atabilir.

Bu yüzden OT sistemlerinde redundancy (yedekleme) mimari düzeyinde düşünülür. Dual power supply, hot-standby kontrolörler, failover mekanizmaları standart beklentilerdir. IT dünyasında "high availability" özel bir gereksinim iken, OT'de temel varsayımdır.

## Protokoller ve Legacy Sistemler

IT ağları modern protokollerle çalışır: HTTPS, TLS 1.3, OAuth2. Güvenlik varsayılan olarak gelir.

OT ağlarında ise Modbus, DNP3, Profinet, OPC gibi protokoller kullanılır. Bu protokollerin çoğu 1970-80'lerde tasarlanmıştır ve hiçbir güvenlik özelliği içermez. Şifreleme yok, kimlik doğrulama yok. Neden? Çünkü o zamanlar bu sistemler izole ortamlarda çalışıyordu. Fabrikanın dışından kimse erişemezdi.

Bugün ise Endüstri 4.0 ve IoT ile bu sistemler artık internete bağlanıyor. Eski protokoller güvensiz ama değiştirilmeleri neredeyse imkânsız. Çözüm? Segmentasyon. OT ağlarını IT ağlarından firewall, DMZ ve unidirectional gateway kullanarak ayırmak.

### Sonuç: Farklı Dünyalar, Farklı Kurallar

IT ve OT sistemlerini aynı kurallarla yönetmeye çalışmak, her iki tarafı da güvensiz bırakır. IT'de işleyen bir güvenlik politikası, OT'de operasyonel felakete yol açabilir. Tersine, OT'nin "çalışıyorsa dokunma" yaklaşımı IT dünyasında sürdürülemez risk yaratır.

Gelecekte bu iki dünyanın birleşmesi kaçınılmaz ama bu birleşme ancak karşılıklı anlayış ve hibrid stratejiler ile gerçekleşebilir.

