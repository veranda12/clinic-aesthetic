import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Consistent Unsplash rendering params for editorial crops.
const img = (id: string, w = 1600, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}${
    h ? `&h=${h}` : ""
  }`;

async function main() {
  console.log("🌱  Seeding AURELIA Skin & Aesthetic…");

  // --- Clean (idempotent reseed) ------------------------------------------
  await prisma.faq.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.article.deleteMany();
  await prisma.articleCategory.deleteMany();
  await prisma.treatment.deleteMany();
  await prisma.treatmentCategory.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.clinicLocation.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.media.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.facility.deleteMany();
  await prisma.review.deleteMany();
  await prisma.adminUser.deleteMany();

  // --- Admin --------------------------------------------------------------
  const email = process.env.ADMIN_EMAIL ?? "admin@aurelia.id";
  const password = process.env.ADMIN_PASSWORD ?? "aurelia-admin";
  await prisma.adminUser.create({
    data: {
      email,
      name: "Aurelia Admin",
      passwordHash: await bcrypt.hash(password, 10),
    },
  });
  console.log(`   • admin user: ${email}`);

  // --- Doctors ------------------------------------------------------------
  const drAnjani = await prisma.doctor.create({
    data: {
      slug: "dr-anjani-pramesti",
      name: "dr. Anjani Pramesti",
      title: "Aesthetic & Dermatology Physician",
      education:
        "Fakultas Kedokteran Universitas Indonesia · Diploma in Aesthetic Medicine (AAAM)",
      specialization: "Acne, skin barrier, dan perawatan kulit sensitif",
      bio: "dr. Anjani percaya bahwa perawatan kulit yang baik dimulai dari mendengarkan. Selama lebih dari sepuluh tahun ia mendampingi pasien dengan kondisi kulit yang kompleks — dari acne yang membandel hingga kulit yang lelah karena perawatan yang keliru.\n\nPendekatannya tenang dan berbasis bukti. Ia lebih memilih membangun fondasi kulit yang sehat sebelum menyarankan tindakan lanjutan, dan selalu menjelaskan alasan di balik setiap rekomendasi.",
      imageUrl: img("1594824476967-48c8b964273f", 1000, 1250),
      imageAlt: "Potret dr. Anjani Pramesti",
      order: 0,
    },
  });

  const drReza = await prisma.doctor.create({
    data: {
      slug: "dr-reza-mahendra",
      name: "dr. Reza Mahendra",
      title: "Laser & Advanced Aesthetic Physician",
      education:
        "Fakultas Kedokteran Universitas Padjadjaran · Advanced Laser Certification",
      specialization: "Laser rejuvenation, pigmentasi, dan skin resurfacing",
      bio: "dr. Reza menangani teknologi laser dan energy-based device di AURELIA. Ketertarikannya pada presisi membuatnya sangat berhati-hati dalam menyesuaikan parameter tindakan dengan jenis dan kondisi kulit setiap pasien.\n\nBaginya, hasil terbaik bukan yang paling dramatis, melainkan yang paling natural dan aman untuk jangka panjang.",
      imageUrl: img("1612349317150-e413f6a5b16d", 1000, 1250),
      imageAlt: "Potret dr. Reza Mahendra",
      order: 1,
    },
  });

  const drSalma = await prisma.doctor.create({
    data: {
      slug: "dr-salma-widari",
      name: "dr. Salma Widari",
      title: "Aesthetic Physician · Age Management",
      education:
        "Fakultas Kedokteran Universitas Gadjah Mada · Aesthetic Medicine Fellowship",
      specialization: "Anti-aging, collagen stimulation, dan skin tightening",
      bio: "dr. Salma mendalami age management dengan filosofi yang halus — merawat, bukan mengubah. Ia bekerja agar pasien tetap terlihat seperti diri mereka sendiri, hanya dengan versi kulit yang lebih segar dan sehat.\n\nKonsultasi bersamanya sering kali dimulai dari percakapan tentang gaya hidup, bukan sekadar tindakan.",
      imageUrl: img("1573496359142-b8d87734a5a2", 1000, 1250),
      imageAlt: "Potret dr. Salma Widari",
      order: 2,
    },
  });

  console.log("   • 3 doctors");

  // --- Treatment categories + treatments ----------------------------------
  const skin = await prisma.treatmentCategory.create({
    data: {
      slug: "skin",
      name: "Skin",
      tagline: "Fondasi kulit yang sehat",
      description:
        "Perawatan yang dirancang untuk memperbaiki dan menjaga kesehatan kulit dari dalam — mengatasi akar masalah, bukan sekadar gejalanya.",
      order: 0,
    },
  });

  const advanced = await prisma.treatmentCategory.create({
    data: {
      slug: "advanced",
      name: "Advanced",
      tagline: "Teknologi dengan pengawasan medis",
      description:
        "Tindakan berbasis teknologi untuk kebutuhan kulit yang lebih spesifik, selalu dilakukan dengan protokol dan pengawasan dokter.",
      order: 1,
    },
  });

  const age = await prisma.treatmentCategory.create({
    data: {
      slug: "age-management",
      name: "Age Management",
      tagline: "Merawat, bukan mengubah",
      description:
        "Program jangka panjang untuk menjaga elastisitas dan kepadatan kulit seiring waktu, dengan pendekatan yang natural.",
      order: 2,
    },
  });

  type Step = { title: string; description: string };
  const t = (data: {
    slug: string;
    name: string;
    summary: string;
    description: string;
    howItWorks?: string;
    whoFor?: string;
    aftercare?: string;
    expected?: string;
    concerns: string[];
    process: Step[];
    duration: string;
    frequency: string;
    priceFrom: number;
    imageId: string;
    gallery?: string[];
    categoryId: string;
    featured?: boolean;
    order: number;
  }) =>
    prisma.treatment.create({
      data: {
        slug: data.slug,
        name: data.name,
        summary: data.summary,
        description: data.description,
        howItWorks: data.howItWorks,
        whoFor: data.whoFor,
        aftercare: data.aftercare,
        expected: data.expected,
        concerns: data.concerns,
        process: data.process,
        duration: data.duration,
        frequency: data.frequency,
        priceFrom: data.priceFrom,
        imageUrl: img(data.imageId),
        imageAlt: `${data.name} di AURELIA Skin & Aesthetic`,
        gallery: data.gallery ?? [],
        featured: data.featured ?? false,
        published: true,
        order: data.order,
        categoryId: data.categoryId,
      },
    });

  // Skin
  const acne = await t({
    slug: "acne-treatment",
    name: "Acne Treatment",
    summary:
      "Program bertahap untuk menenangkan peradangan dan mengembalikan keseimbangan kulit berjerawat.",
    description:
      "Acne bukan sekadar masalah permukaan. Di AURELIA, perawatan acne dimulai dari memahami pemicunya — mulai dari hormon, produksi minyak berlebih, hingga kerusakan skin barrier akibat perawatan yang terlalu agresif.\n\nKami merancang program bertahap yang menenangkan peradangan aktif, membersihkan pori secara medis, dan membangun kembali kulit yang lebih stabil dalam jangka panjang.",
    howItWorks:
      "Perawatan dikombinasikan sesuai kondisi: deep cleansing medis, ekstraksi komedo yang aman, terapi cahaya untuk menekan bakteri, dan penyesuaian rangkaian skincare harian. Fokusnya adalah mengurangi peradangan tanpa merusak lapisan pelindung kulit.",
    whoFor:
      "Cocok untuk kulit dengan jerawat aktif ringan hingga sedang, komedo membandel, atau kulit yang menjadi sensitif setelah berbagai percobaan perawatan.",
    aftercare:
      "Hindari eksfoliasi berlebihan dan produk yang mengandung alkohol tinggi. Gunakan pelembap yang menenangkan dan tabir surya setiap pagi. Tim kami akan memberi panduan rangkaian harian yang spesifik.",
    expected:
      "Peradangan biasanya mulai mereda dalam beberapa sesi pertama. Perbaikan tekstur dan berkurangnya jerawat baru umumnya terlihat setelah program dijalani secara konsisten.",
    concerns: ["Jerawat aktif", "Komedo", "Bekas jerawat", "Pori besar", "Kulit berminyak"],
    process: [
      { title: "Konsultasi & analisa kulit", description: "Dokter menilai jenis jerawat, kondisi barrier, dan pemicunya." },
      { title: "Deep cleansing medis", description: "Pembersihan dan ekstraksi pori secara aman dan higienis." },
      { title: "Terapi penenang", description: "Light therapy atau serum aktif untuk menekan peradangan." },
      { title: "Rencana perawatan harian", description: "Penyesuaian skincare dan jadwal sesi lanjutan." },
    ],
    duration: "45–60 menit",
    frequency: "Setiap 2–4 minggu",
    priceFrom: 450000,
    imageId: "1616394584738-fc6e612e71b9",
    gallery: [
      img("1570172619644-dfd03ed5d881"),
      img("1552693673-1bf958298935"),
      img("1596755094514-f87e34085b2c"),
    ],
    categoryId: skin.id,
    featured: true,
    order: 0,
  });

  await t({
    slug: "brightening",
    name: "Brightening",
    summary:
      "Mengembalikan cerah alami kulit dengan pendekatan yang lembut dan terukur.",
    description:
      "Kulit kusam sering kali merupakan tanda dehidrasi, penumpukan sel kulit mati, atau paparan sinar matahari. Perawatan brightening kami berfokus pada mengembalikan kilau sehat kulit secara bertahap — bukan memutihkan.\n\nKombinasi eksfoliasi lembut, infus antioksidan, dan hidrasi mendalam membantu kulit tampak lebih segar dan merata.",
    howItWorks:
      "Serum kaya antioksidan dan bahan pencerah dihantarkan ke kulit, dikombinasikan dengan eksfoliasi ringan untuk mempercepat regenerasi sel dan meratakan warna kulit.",
    whoFor:
      "Kulit kusam, tidak merata, atau lelah karena kurang tidur dan paparan sinar matahari.",
    aftercare:
      "Penggunaan tabir surya wajib untuk menjaga hasil. Hindari paparan matahari langsung berlebihan.",
    expected: "Kulit tampak lebih segar dan bercahaya secara bertahap dengan perawatan rutin.",
    concerns: ["Kulit kusam", "Warna tidak merata", "Kulit lelah", "Dehidrasi"],
    process: [
      { title: "Analisa tingkat kekusaman", description: "Menilai penyebab utama kulit kusam." },
      { title: "Eksfoliasi lembut", description: "Mengangkat sel kulit mati tanpa iritasi." },
      { title: "Infus antioksidan", description: "Menghantarkan bahan pencerah dan pelembap." },
    ],
    duration: "45 menit",
    frequency: "Setiap 3–4 minggu",
    priceFrom: 550000,
    imageId: "1570172619644-dfd03ed5d881",
    categoryId: skin.id,
    featured: true,
    order: 1,
  });

  await t({
    slug: "pigmentation",
    name: "Pigmentation",
    summary:
      "Menyamarkan flek dan hiperpigmentasi dengan protokol yang menjaga kesehatan kulit.",
    description:
      "Pigmentasi seperti melasma dan flek matahari membutuhkan penanganan yang sabar dan tepat. Perawatan yang salah justru dapat memperparah kondisi.\n\nKami menggabungkan tindakan medis dengan penyesuaian skincare untuk menyamarkan pigmentasi secara bertahap dan mencegah kemunculannya kembali.",
    howItWorks:
      "Kombinasi bahan aktif penghambat melanin, eksfoliasi terukur, dan bila diperlukan tindakan berbasis cahaya untuk memecah pigmen berlebih.",
    whoFor: "Kulit dengan flek, melasma ringan hingga sedang, atau bekas pigmentasi.",
    aftercare: "Perlindungan matahari sangat penting. Hasil membutuhkan kesabaran dan konsistensi.",
    expected: "Pigmentasi memudar secara bertahap; hasil optimal butuh beberapa bulan.",
    concerns: ["Flek", "Melasma", "Hiperpigmentasi", "Bekas jerawat gelap"],
    process: [
      { title: "Pemetaan pigmen", description: "Menilai kedalaman dan jenis pigmentasi." },
      { title: "Terapi terarah", description: "Penanganan medis sesuai jenis pigmentasi." },
      { title: "Program pemeliharaan", description: "Skincare dan perlindungan untuk mencegah kambuh." },
    ],
    duration: "45–60 menit",
    frequency: "Setiap 3–4 minggu",
    priceFrom: 650000,
    imageId: "1596755094514-f87e34085b2c",
    categoryId: skin.id,
    order: 2,
  });

  await t({
    slug: "hydration",
    name: "Hydration",
    summary: "Mengembalikan kelembapan dan kenyamanan kulit yang kering dan tertarik.",
    description:
      "Kulit yang terhidrasi dengan baik terlihat lebih kenyal, halus, dan sehat. Perawatan hydration kami mengisi kembali kelembapan kulit hingga ke lapisan yang lebih dalam.\n\nCocok sebagai perawatan rutin untuk menjaga kulit tetap nyaman, terutama bagi mereka yang sering berada di ruangan ber-AC.",
    howItWorks:
      "Hyaluronic acid dan bahan pelembap dihantarkan ke kulit, dikombinasikan dengan masker dan pijatan lembut untuk merilekskan kulit.",
    whoFor: "Kulit kering, tertarik, atau kusam akibat dehidrasi.",
    aftercare: "Jaga asupan air dan gunakan pelembap secara rutin di rumah.",
    expected: "Kulit terasa lebih lembut dan kenyal segera setelah perawatan.",
    concerns: ["Kulit kering", "Dehidrasi", "Kulit tertarik", "Garis halus"],
    process: [
      { title: "Pembersihan lembut", description: "Menyiapkan kulit untuk menyerap kelembapan." },
      { title: "Infus hidrasi", description: "Menghantarkan hyaluronic acid ke kulit." },
      { title: "Masker penenang", description: "Mengunci kelembapan dan menenangkan kulit." },
    ],
    duration: "45 menit",
    frequency: "Setiap 2–4 minggu",
    priceFrom: 400000,
    imageId: "1552693673-1bf958298935",
    categoryId: skin.id,
    order: 3,
  });

  await t({
    slug: "skin-barrier",
    name: "Skin Barrier Repair",
    summary: "Memulihkan lapisan pelindung kulit yang rusak akibat over-treatment.",
    description:
      "Skin barrier yang rusak membuat kulit menjadi sensitif, mudah kemerahan, dan bereaksi berlebihan terhadap produk. Kondisi ini sering muncul akibat eksfoliasi berlebihan atau penggunaan bahan aktif yang terlalu keras.\n\nPerawatan ini fokus menenangkan dan membangun kembali fungsi pelindung kulit secara bertahap.",
    howItWorks:
      "Menggunakan bahan penenang dan pemulih barrier seperti ceramide dan panthenol, disertai penyederhanaan rangkaian skincare harian.",
    whoFor: "Kulit sensitif, mudah kemerahan, atau rusak akibat over-treatment.",
    aftercare: "Sederhanakan skincare, hindari bahan aktif keras sementara waktu.",
    expected: "Kulit menjadi lebih tenang dan tidak mudah bereaksi seiring pemulihan barrier.",
    concerns: ["Kulit sensitif", "Kemerahan", "Iritasi", "Over-exfoliation"],
    process: [
      { title: "Penilaian barrier", description: "Mengukur tingkat kerusakan pelindung kulit." },
      { title: "Terapi penenang", description: "Bahan pemulih untuk menenangkan kulit." },
      { title: "Reset skincare", description: "Menyederhanakan rangkaian harian." },
    ],
    duration: "45 menit",
    frequency: "Setiap 2–3 minggu",
    priceFrom: 500000,
    imageId: "1600334129128-685c5582fd35",
    categoryId: skin.id,
    order: 4,
  });

  // Advanced
  const laser = await t({
    slug: "laser-rejuvenation",
    name: "Laser Rejuvenation",
    summary: "Meremajakan kulit dan meratakan tekstur dengan teknologi laser terkini.",
    description:
      "Laser rejuvenation membantu memperbaiki tekstur kulit, menyamarkan pori, dan merangsang produksi kolagen. Di AURELIA, setiap tindakan laser disesuaikan dengan kondisi kulit dan dilakukan oleh dokter berpengalaman.\n\nKami mengutamakan keamanan dan hasil yang natural — bukan perubahan yang berlebihan.",
    howItWorks:
      "Energi laser yang terkontrol menstimulasi lapisan kulit untuk memperbaharui diri dan memproduksi kolagen baru, sehingga kulit tampak lebih halus dan segar.",
    whoFor: "Kulit dengan tekstur tidak rata, pori besar, atau tanda penuaan dini.",
    aftercare: "Hindari matahari langsung dan gunakan tabir surya. Kulit mungkin sedikit kemerahan sementara.",
    expected: "Tekstur kulit membaik secara bertahap seiring produksi kolagen baru.",
    concerns: ["Tekstur tidak rata", "Pori besar", "Garis halus", "Kulit kusam"],
    process: [
      { title: "Konsultasi laser", description: "Menentukan jenis dan parameter laser yang aman." },
      { title: "Persiapan kulit", description: "Pembersihan dan aplikasi krim penenang." },
      { title: "Tindakan laser", description: "Dilakukan dokter dengan parameter terukur." },
      { title: "Pendinginan & pemulihan", description: "Menenangkan kulit setelah tindakan." },
    ],
    duration: "60 menit",
    frequency: "Setiap 4–6 minggu",
    priceFrom: 1200000,
    imageId: "1559599101-f09722fb4948",
    gallery: [
      img("1612349317150-e413f6a5b16d"),
      img("1598440947619-2c35fc9aa908"),
    ],
    categoryId: advanced.id,
    featured: true,
    order: 0,
  });

  await t({
    slug: "ipl",
    name: "IPL Photofacial",
    summary: "Menyamarkan kemerahan dan flek dengan intense pulsed light.",
    description:
      "IPL menggunakan cahaya berspektrum luas untuk mengatasi kemerahan, flek matahari, dan warna kulit yang tidak merata dalam satu tindakan.\n\nTeknologi ini bekerja lembut di permukaan sekaligus merangsang perbaikan kulit dari dalam.",
    howItWorks:
      "Cahaya IPL diserap oleh pigmen dan pembuluh darah kecil, memecahnya secara bertahap sehingga warna kulit tampak lebih merata.",
    whoFor: "Kulit dengan kemerahan, flek matahari, atau warna tidak merata.",
    aftercare: "Perlindungan matahari wajib. Flek mungkin tampak lebih gelap sementara sebelum memudar.",
    expected: "Warna kulit tampak lebih merata setelah beberapa sesi.",
    concerns: ["Kemerahan", "Flek matahari", "Warna tidak merata", "Kapiler halus"],
    process: [
      { title: "Analisa kulit", description: "Menilai jenis pigmen dan kemerahan." },
      { title: "Tindakan IPL", description: "Aplikasi cahaya secara merata dan terukur." },
      { title: "Pemulihan", description: "Menenangkan kulit dan panduan perawatan." },
    ],
    duration: "45–60 menit",
    frequency: "Setiap 3–4 minggu",
    priceFrom: 950000,
    imageId: "1612349317150-e413f6a5b16d",
    categoryId: advanced.id,
    order: 1,
  });

  await t({
    slug: "chemical-peeling",
    name: "Chemical Peeling",
    summary: "Eksfoliasi medis untuk memperbarui permukaan kulit secara terkontrol.",
    description:
      "Chemical peeling mengangkat lapisan sel kulit mati secara terkontrol untuk mengungkap kulit yang lebih halus dan cerah di bawahnya.\n\nJenis dan konsentrasi larutan disesuaikan dengan kondisi kulit oleh dokter, sehingga aman dan efektif.",
    howItWorks:
      "Larutan aktif diaplikasikan untuk mempercepat pergantian sel kulit, memperbaiki tekstur, dan menyamarkan noda.",
    whoFor: "Kulit kusam, berjerawat, atau dengan tekstur dan pigmentasi ringan.",
    aftercare: "Kulit mungkin mengelupas ringan. Hindari matahari dan jangan mengelupas paksa.",
    expected: "Kulit tampak lebih cerah dan halus setelah proses pengelupasan selesai.",
    concerns: ["Kulit kusam", "Tekstur kasar", "Jerawat", "Pigmentasi ringan"],
    process: [
      { title: "Penilaian kulit", description: "Menentukan jenis peeling yang sesuai." },
      { title: "Aplikasi larutan", description: "Larutan aktif diaplikasikan secara terukur." },
      { title: "Netralisasi & penenangan", description: "Menghentikan proses dan menenangkan kulit." },
    ],
    duration: "30–45 menit",
    frequency: "Setiap 3–4 minggu",
    priceFrom: 700000,
    imageId: "1607779097040-26e80aa78e66",
    categoryId: advanced.id,
    order: 2,
  });

  await t({
    slug: "microneedling",
    name: "Microneedling",
    summary: "Merangsang kolagen alami untuk memperbaiki tekstur dan bekas jerawat.",
    description:
      "Microneedling menciptakan micro-channel pada kulit yang memicu proses penyembuhan alami dan produksi kolagen baru.\n\nEfektif untuk memperbaiki bekas jerawat, pori besar, dan tekstur kulit yang tidak rata.",
    howItWorks:
      "Jarum halus steril menstimulasi lapisan kulit untuk memperbaharui diri, sering dikombinasikan dengan serum untuk hasil maksimal.",
    whoFor: "Kulit dengan bekas jerawat, pori besar, atau tekstur tidak rata.",
    aftercare: "Kulit mungkin kemerahan 1–2 hari. Hindari makeup dan matahari sementara.",
    expected: "Tekstur dan bekas jerawat membaik bertahap seiring produksi kolagen.",
    concerns: ["Bekas jerawat", "Pori besar", "Tekstur tidak rata", "Garis halus"],
    process: [
      { title: "Persiapan & anestesi topikal", description: "Krim penenang untuk kenyamanan." },
      { title: "Microneedling", description: "Stimulasi kulit dengan kedalaman terukur." },
      { title: "Aplikasi serum", description: "Serum pemulih untuk mempercepat regenerasi." },
    ],
    duration: "60 menit",
    frequency: "Setiap 4–6 minggu",
    priceFrom: 1100000,
    imageId: "1598440947619-2c35fc9aa908",
    categoryId: advanced.id,
    order: 3,
  });

  // Age Management
  await t({
    slug: "anti-aging",
    name: "Anti Aging Program",
    summary: "Program menyeluruh untuk menjaga kulit tetap segar seiring waktu.",
    description:
      "Anti aging di AURELIA bukan tentang menghentikan waktu, melainkan merawat kulit agar menua dengan sehat dan anggun.\n\nProgram ini menggabungkan beberapa pendekatan yang disesuaikan dengan usia, kondisi kulit, dan gaya hidup Anda.",
    howItWorks:
      "Kombinasi stimulasi kolagen, hidrasi mendalam, dan perawatan permukaan untuk menjaga elastisitas dan kepadatan kulit.",
    whoFor: "Kulit dengan tanda penuaan dini hingga sedang yang ingin dijaga secara natural.",
    aftercare: "Konsistensi dan perlindungan matahari adalah kunci hasil jangka panjang.",
    expected: "Kulit tampak lebih segar, kenyal, dan terawat secara bertahap.",
    concerns: ["Garis halus", "Kerutan", "Kulit kendur", "Kehilangan elastisitas"],
    process: [
      { title: "Konsultasi menyeluruh", description: "Menilai kondisi kulit dan gaya hidup." },
      { title: "Rancangan program", description: "Menyusun kombinasi perawatan yang sesuai." },
      { title: "Perawatan bertahap", description: "Sesi berkala dengan evaluasi rutin." },
    ],
    duration: "60–75 menit",
    frequency: "Setiap 4–6 minggu",
    priceFrom: 1500000,
    imageId: "1616683693504-3ea7e9ad6fec",
    categoryId: age.id,
    featured: true,
    order: 0,
  });

  await t({
    slug: "collagen-treatment",
    name: "Collagen Treatment",
    summary: "Merangsang produksi kolagen untuk kulit yang lebih kenyal dan padat.",
    description:
      "Seiring bertambahnya usia, produksi kolagen alami menurun. Collagen treatment membantu menstimulasi kembali produksi kolagen untuk menjaga kepadatan dan kekenyalan kulit.\n\nHasilnya adalah kulit yang tampak lebih muda secara natural.",
    howItWorks:
      "Stimulasi terarah pada lapisan kulit memicu produksi kolagen baru, memperbaiki kepadatan dan elastisitas.",
    whoFor: "Kulit yang mulai kehilangan kekenyalan dan kepadatannya.",
    aftercare: "Jaga hidrasi dan perlindungan matahari untuk hasil optimal.",
    expected: "Kulit terasa lebih kenyal dan padat secara bertahap.",
    concerns: ["Kulit kendur", "Kehilangan volume", "Garis halus", "Kulit tipis"],
    process: [
      { title: "Analisa kepadatan kulit", description: "Menilai area yang membutuhkan stimulasi." },
      { title: "Stimulasi kolagen", description: "Tindakan terarah untuk memicu kolagen baru." },
      { title: "Pemeliharaan", description: "Panduan perawatan untuk menjaga hasil." },
    ],
    duration: "60 menit",
    frequency: "Setiap 6–8 minggu",
    priceFrom: 1800000,
    imageId: "1571019613454-1cb2f99b2d8b",
    categoryId: age.id,
    order: 1,
  });

  await t({
    slug: "skin-tightening",
    name: "Skin Tightening",
    summary: "Mengencangkan kulit yang mulai kendur tanpa tindakan invasif.",
    description:
      "Skin tightening menggunakan energi terkontrol untuk mengencangkan kulit yang mulai kendur, terutama di area wajah dan rahang.\n\nAlternatif non-invasif yang memberikan hasil bertahap dan natural.",
    howItWorks:
      "Energi (seperti radiofrequency) memanaskan lapisan kulit secara terkontrol untuk merangsang pengencangan dan produksi kolagen.",
    whoFor: "Kulit yang mulai kendur ringan hingga sedang di area wajah dan leher.",
    aftercare: "Tidak memerlukan waktu pemulihan khusus. Jaga hidrasi kulit.",
    expected: "Kulit terasa lebih kencang secara bertahap dalam beberapa minggu.",
    concerns: ["Kulit kendur", "Garis rahang tidak tegas", "Kehilangan elastisitas"],
    process: [
      { title: "Penilaian area", description: "Menentukan area yang membutuhkan pengencangan." },
      { title: "Tindakan energy-based", description: "Aplikasi energi terukur pada kulit." },
      { title: "Evaluasi hasil", description: "Menilai perkembangan pada sesi berikutnya." },
    ],
    duration: "45–60 menit",
    frequency: "Setiap 6–8 minggu",
    priceFrom: 1600000,
    imageId: "1519824145371-296894a0daa9",
    categoryId: age.id,
    order: 2,
  });

  console.log("   • 12 treatments in 3 categories");

  // --- Treatment FAQs -----------------------------------------------------
  await prisma.faq.createMany({
    data: [
      {
        treatmentId: acne.id,
        question: "Berapa lama hasil acne treatment mulai terlihat?",
        answer:
          "Peradangan biasanya mulai mereda dalam beberapa sesi pertama. Untuk hasil yang stabil, program umumnya dijalani selama beberapa minggu hingga bulan tergantung kondisi kulit.",
        group: "treatment",
        order: 0,
      },
      {
        treatmentId: acne.id,
        question: "Apakah perawatan ini aman untuk kulit sensitif?",
        answer:
          "Ya. Justru salah satu fokus kami adalah menenangkan peradangan tanpa merusak skin barrier. Dokter akan menyesuaikan intensitas perawatan dengan kondisi kulit Anda.",
        group: "treatment",
        order: 1,
      },
      {
        treatmentId: acne.id,
        question: "Apakah saya tetap perlu skincare di rumah?",
        answer:
          "Sangat perlu. Perawatan di klinik dan skincare harian saling melengkapi. Tim kami akan membantu menyusun rangkaian yang sesuai dan tidak berlebihan.",
        group: "treatment",
        order: 2,
      },
      {
        treatmentId: laser.id,
        question: "Apakah laser terasa sakit?",
        answer:
          "Kebanyakan pasien merasakan sensasi hangat yang ringan. Kami menggunakan krim penenang dan mengatur parameter agar tetap nyaman.",
        group: "treatment",
        order: 0,
      },
      {
        treatmentId: laser.id,
        question: "Berapa lama waktu pemulihannya?",
        answer:
          "Umumnya kulit hanya sedikit kemerahan selama beberapa jam hingga satu hari. Anda tetap dapat beraktivitas dengan perlindungan matahari yang baik.",
        group: "treatment",
        order: 1,
      },
    ],
  });

  // --- General FAQs -------------------------------------------------------
  await prisma.faq.createMany({
    data: [
      {
        question: "Apakah saya perlu konsultasi sebelum perawatan?",
        answer:
          "Ya, kami selalu menyarankan konsultasi terlebih dahulu. Setiap kulit berbeda, dan konsultasi membantu dokter merancang perawatan yang benar-benar sesuai untuk Anda.",
        group: "general",
        order: 0,
      },
      {
        question: "Bagaimana cara membuat janji?",
        answer:
          "Anda dapat menghubungi kami melalui WhatsApp atau telepon. Tim kami akan membantu menjadwalkan konsultasi pada waktu yang nyaman untuk Anda.",
        group: "general",
        order: 1,
      },
      {
        question: "Apakah perawatan di AURELIA aman?",
        answer:
          "Seluruh tindakan dilakukan atau diawasi langsung oleh dokter berpengalaman, dengan protokol kebersihan dan keamanan yang ketat.",
        group: "general",
        order: 2,
      },
      {
        question: "Apakah hasilnya permanen?",
        answer:
          "Kesehatan kulit membutuhkan pemeliharaan. Kami akan jujur menjelaskan hasil yang realistis dan membantu Anda menjaganya dalam jangka panjang.",
        group: "general",
        order: 3,
      },
      {
        question: "Apakah AURELIA menerima pasien pria?",
        answer:
          "Tentu. Perawatan kami dirancang untuk semua jenis kulit, baik perempuan maupun laki-laki.",
        group: "general",
        order: 4,
      },
      {
        question: "Berapa biaya konsultasi?",
        answer:
          "Silakan hubungi kami untuk informasi biaya konsultasi terkini. Tim kami akan menjelaskan dengan transparan sebelum Anda memutuskan.",
        group: "general",
        order: 5,
      },
    ],
  });

  console.log("   • FAQs");

  // --- Testimonials -------------------------------------------------------
  await prisma.testimonial.createMany({
    data: [
      {
        author: "Dinda A.",
        context: "Acne Treatment · 6 sesi",
        quote:
          "Yang membuat saya bertahan bukan cuma hasilnya, tapi caranya menjelaskan. Untuk pertama kalinya saya paham kenapa kulit saya bermasalah, bukan sekadar disuruh beli produk.",
        rating: 5,
        treatmentId: acne.id,
        order: 0,
      },
      {
        author: "Meilani S.",
        context: "Brightening · rutin",
        quote:
          "Kulit saya jadi terlihat lebih segar tanpa terlihat 'dikerjakan'. Itu yang saya cari selama ini. Terlihat natural.",
        rating: 5,
        order: 1,
      },
      {
        author: "Raka P.",
        context: "Laser Rejuvenation",
        quote:
          "Awalnya ragu karena saya laki-laki. Ternyata dokternya sangat detail dan tidak berlebihan menawarkan tindakan. Recommend.",
        rating: 5,
        treatmentId: laser.id,
        order: 2,
      },
      {
        author: "Larasati W.",
        context: "Anti Aging Program",
        quote:
          "Saya suka pendekatannya yang tenang. Tidak ada tekanan untuk ini-itu. Semua dijelaskan dengan sabar dan hasilnya terasa.",
        rating: 5,
        order: 3,
      },
      {
        author: "Nadia K.",
        context: "Skin Barrier Repair",
        quote:
          "Kulit saya sempat rusak karena salah perawatan. Di sini justru diminta menyederhanakan skincare. Sekarang jauh lebih tenang.",
        rating: 5,
        order: 4,
      },
    ],
  });

  console.log("   • testimonials");

  // --- Article categories + articles --------------------------------------
  const catSkincare = await prisma.articleCategory.create({
    data: { slug: "skincare", name: "Skincare", order: 0 },
  });
  const catTreatment = await prisma.articleCategory.create({
    data: { slug: "treatment", name: "Treatment", order: 1 },
  });
  const catAging = await prisma.articleCategory.create({
    data: { slug: "age-management", name: "Age Management", order: 2 },
  });

  const article = (data: {
    slug: string;
    title: string;
    excerpt: string;
    body: string;
    imageId: string;
    readMinutes: number;
    categoryId: string;
    authorId: string;
    daysAgo: number;
  }) =>
    prisma.article.create({
      data: {
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        body: data.body,
        imageUrl: img(data.imageId),
        imageAlt: data.title,
        readMinutes: data.readMinutes,
        published: true,
        publishedAt: new Date(Date.now() - data.daysAgo * 86400000),
        categoryId: data.categoryId,
        authorId: data.authorId,
      },
    });

  await article({
    slug: "kenapa-skin-barrier-bisa-rusak",
    title: "Kenapa Skin Barrier Bisa Rusak?",
    excerpt:
      "Skin barrier adalah garis pertahanan pertama kulit. Ketika ia rusak, kulit menjadi sensitif dan mudah bereaksi. Berikut penyebab yang paling sering kami temui.",
    body: "Skin barrier adalah lapisan terluar kulit yang berfungsi menjaga kelembapan dan melindungi dari iritan. Ketika lapisan ini terganggu, kulit menjadi lebih rentan — mudah kemerahan, terasa perih, dan bereaksi berlebihan terhadap produk yang biasanya aman.\n\nPenyebab paling umum yang kami temui adalah eksfoliasi berlebihan. Keinginan untuk memiliki kulit yang halus dan cerah sering kali membuat seseorang menggunakan terlalu banyak bahan aktif dalam waktu bersamaan.\n\nPenggunaan bahan aktif yang tidak tepat juga berperan besar. Kombinasi retinoid, AHA/BHA, dan vitamin C berkonsentrasi tinggi tanpa panduan dapat membuat kulit kewalahan.\n\nTanda-tanda skin barrier yang rusak antara lain kulit terasa kencang setelah mencuci muka, kemerahan yang tidak biasa, sensasi perih saat mengaplikasikan produk, dan kulit yang tampak kusam meski sudah dirawat.\n\nKabar baiknya, skin barrier bisa dipulihkan. Kuncinya adalah menyederhanakan rangkaian perawatan, menghentikan sementara bahan aktif yang keras, dan fokus pada hidrasi serta bahan penenang seperti ceramide dan panthenol.\n\nJika kulit Anda menunjukkan tanda-tanda ini, konsultasi dengan dokter dapat membantu menyusun langkah pemulihan yang tepat tanpa memperparah kondisi.",
    imageId: "1600334129128-685c5582fd35",
    readMinutes: 5,
    categoryId: catSkincare.id,
    authorId: drAnjani.id,
    daysAgo: 3,
  });

  await article({
    slug: "acne-treatment-apa-yang-perlu-kamu-ketahui",
    title: "Acne Treatment: Apa yang Perlu Kamu Ketahui?",
    excerpt:
      "Sebelum memulai perawatan jerawat, ada beberapa hal penting yang sebaiknya Anda pahami agar ekspektasi tetap realistis dan kulit tetap sehat.",
    body: "Jerawat adalah salah satu keluhan kulit yang paling umum, namun juga salah satu yang paling sering salah ditangani. Sebelum memulai perawatan, penting untuk memahami beberapa hal.\n\nPertama, jerawat memiliki banyak penyebab. Hormon, produksi minyak berlebih, bakteri, dan pola hidup semuanya berperan. Karena itu, tidak ada satu solusi tunggal yang cocok untuk semua orang.\n\nKedua, kesabaran adalah bagian dari perawatan. Kulit membutuhkan waktu untuk merespons. Perawatan yang menjanjikan hasil instan justru sering kali terlalu agresif dan berisiko merusak kulit.\n\nKetiga, merusak skin barrier demi menghilangkan jerawat adalah kesalahan umum. Kulit yang terlalu sering dieksfoliasi atau dikeringkan justru dapat memproduksi lebih banyak minyak dan memperparah kondisi.\n\nDi AURELIA, kami mendekati jerawat secara bertahap — menenangkan peradangan, membersihkan pori secara medis, dan membangun kembali kulit yang stabil. Perawatan di klinik selalu disertai penyesuaian skincare harian.\n\nYang terpenting, perawatan jerawat yang baik tidak hanya menghilangkan jerawat hari ini, tetapi membangun kulit yang lebih sehat untuk jangka panjang.",
    imageId: "1616394584738-fc6e612e71b9",
    readMinutes: 6,
    categoryId: catTreatment.id,
    authorId: drAnjani.id,
    daysAgo: 9,
  });

  await article({
    slug: "kapan-sebaiknya-mulai-perawatan-anti-aging",
    title: "Kapan Sebaiknya Mulai Perawatan Anti-Aging?",
    excerpt:
      "Tidak ada usia yang 'benar' untuk memulai. Namun ada prinsip yang bisa membantu Anda mengambil keputusan dengan tenang.",
    body: "Pertanyaan ini sering muncul di ruang konsultasi kami. Jawabannya bukan angka usia tertentu, melainkan pemahaman tentang bagaimana kulit menua.\n\nProses penuaan kulit sebenarnya dimulai lebih awal dari yang banyak orang kira. Penurunan produksi kolagen dapat dimulai sejak usia pertengahan dua puluhan, meski tanda-tandanya belum terlihat.\n\nKarena itu, pendekatan terbaik adalah pencegahan. Perlindungan matahari yang konsisten sejak muda adalah langkah anti-aging paling efektif dan paling sering diabaikan.\n\nUntuk perawatan aktif, tidak ada salahnya memulai ketika Anda mulai memperhatikan perubahan — garis halus yang menetap, kulit yang terasa kurang kenyal, atau warna yang tidak lagi merata.\n\nYang penting untuk diingat: anti-aging bukan tentang mengejar wajah yang lebih muda, melainkan menjaga kulit tetap sehat dan terawat seiring waktu. Pendekatan yang berlebihan justru sering kali membuat hasil terlihat tidak natural.\n\nKonsultasi dapat membantu Anda memahami kondisi kulit saat ini dan menyusun langkah yang sesuai — tanpa terburu-buru.",
    imageId: "1616683693504-3ea7e9ad6fec",
    readMinutes: 5,
    categoryId: catAging.id,
    authorId: drSalma.id,
    daysAgo: 16,
  });

  await article({
    slug: "laser-vs-chemical-peeling",
    title: "Laser vs Chemical Peeling: Mana yang Tepat untuk Kulit Anda?",
    excerpt:
      "Keduanya efektif untuk memperbaiki tekstur dan warna kulit, tetapi bekerja dengan cara yang berbeda. Berikut cara memahaminya.",
    body: "Laser dan chemical peeling sama-sama bertujuan memperbaiki tekstur dan warna kulit, namun pendekatannya berbeda. Memahami perbedaannya membantu Anda dan dokter memilih yang paling sesuai.\n\nChemical peeling bekerja dengan mengaplikasikan larutan aktif yang mempercepat pergantian sel kulit. Larutan ini mengangkat lapisan sel kulit mati sehingga mengungkap kulit yang lebih halus dan cerah. Jenis dan konsentrasinya bisa disesuaikan, mulai dari yang ringan hingga sedang.\n\nLaser bekerja dengan energi cahaya yang terkontrol untuk menargetkan lapisan kulit tertentu, merangsang produksi kolagen dan memperbaiki tekstur dari dalam. Laser umumnya lebih presisi untuk masalah spesifik seperti pori besar atau tanda penuaan.\n\nMana yang lebih baik? Tidak ada jawaban tunggal. Chemical peeling sering menjadi pilihan yang baik untuk memperbaiki kekusaman dan tekstur ringan. Laser cenderung dipilih untuk masalah yang lebih spesifik atau ketika dibutuhkan stimulasi kolagen yang lebih dalam.\n\nDalam praktiknya, keduanya bahkan bisa saling melengkapi dalam sebuah program perawatan. Yang terpenting adalah penilaian dokter terhadap kondisi kulit Anda, bukan sekadar mengikuti tren.",
    imageId: "1607779097040-26e80aa78e66",
    readMinutes: 6,
    categoryId: catTreatment.id,
    authorId: drReza.id,
    daysAgo: 24,
  });

  console.log("   • 4 journal articles");

  // --- Clinic location ----------------------------------------------------
  await prisma.clinicLocation.create({
    data: {
      name: "AURELIA Skin & Aesthetic — Senopati",
      address: "Jl. Senopati No. 88, Kebayoran Baru",
      city: "Jakarta Selatan 12190",
      phone: "+62 21 5060 8899",
      whatsapp: "+62 812 8899 7788",
      email: "hello@aurelia.id",
      instagram: "@aurelia.skin",
      // Keyless Google Maps embed (output=embed) — works without an API key or
      // the encrypted `pb` token. Replace via Admin → Clinic Info with a real
      // embed if desired.
      mapEmbedUrl:
        "https://maps.google.com/maps?q=Jl.%20Senopati%20No.%2088%2C%20Kebayoran%20Baru%2C%20Jakarta%20Selatan&t=&z=15&ie=UTF8&iwloc=&output=embed",
      hours: [
        { day: "Senin – Jumat", hours: "10.00 – 20.00" },
        { day: "Sabtu", hours: "09.00 – 18.00" },
        { day: "Minggu", hours: "10.00 – 16.00" },
        { day: "Hari libur nasional", hours: "Tutup" },
      ],
      isPrimary: true,
      order: 0,
    },
  });

  console.log("   • clinic location");

  // --- Site settings ------------------------------------------------------
  await prisma.siteSetting.createMany({
    data: [
      { key: "hero_heading", value: "Skin confidence, thoughtfully created." },
      {
        key: "hero_subcopy",
        value:
          "Aesthetic clinic di Jakarta Selatan yang merancang perawatan berdasarkan kondisi dan kebutuhan kulit Anda — dengan pendekatan medis yang tenang dan hasil yang natural.",
      },
      { key: "hero_image", value: img("1487412720507-e7ab37603c6f", 2000) },
      {
        key: "about_philosophy",
        value:
          "Kami percaya perawatan kulit terbaik dimulai dari mendengarkan, bukan menjual.",
      },
    ],
  });

  console.log("   • site settings");

  // --- Certificates -------------------------------------------------------
  await prisma.certificate.createMany({
    data: [
      {
        title: "Izin Operasional Klinik",
        issuer: "Dinas Kesehatan Provinsi DKI Jakarta",
        category: "Perizinan & Legalitas",
        year: "2023",
        description:
          "Izin resmi penyelenggaraan klinik yang memastikan seluruh layanan berjalan sesuai standar dan regulasi kesehatan yang berlaku.",
        imageUrl: img("1554224155-6726b3ff858f", 1200),
        imageAlt: "Dokumen izin operasional klinik",
        order: 0,
      },
      {
        title: "Nomor Induk Berusaha (NIB)",
        issuer: "Online Single Submission (OSS) — BKPM",
        category: "Perizinan & Legalitas",
        year: "2023",
        description:
          "Legalitas badan usaha yang terdaftar resmi melalui sistem perizinan berusaha terintegrasi.",
        imageUrl: img("1517842645767-c639042777db", 1200),
        imageAlt: "Dokumen legalitas usaha",
        order: 1,
      },
      {
        title: "Akreditasi Klinik Pratama",
        issuer: "Lembaga Akreditasi Fasilitas Kesehatan Tingkat Pertama",
        category: "Akreditasi",
        year: "2024",
        description:
          "Pengakuan atas pemenuhan standar mutu dan keselamatan pasien dalam penyelenggaraan pelayanan klinik.",
        imageUrl: img("1583321500900-82807e458f3c", 1200),
        imageAlt: "Sertifikat akreditasi klinik",
        order: 2,
      },
      {
        title: "Certified Aesthetic Practitioner",
        issuer: "American Academy of Aesthetic Medicine (AAAM)",
        category: "Sertifikasi Medis",
        year: "2022",
        description:
          "Sertifikasi kompetensi dokter dalam praktik aesthetic medicine berbasis standar internasional.",
        imageUrl: img("1589829545856-d10d557cf95f", 1200),
        imageAlt: "Sertifikat aesthetic practitioner",
        order: 3,
      },
      {
        title: "Advanced Laser Safety Certification",
        issuer: "Advanced Laser Training Institute",
        category: "Sertifikasi Medis",
        year: "2023",
        description:
          "Pelatihan lanjutan penggunaan dan keamanan energy-based device untuk memastikan setiap tindakan laser dilakukan secara aman.",
        imageUrl: img("1607013251379-e6eecfffe234", 1200),
        imageAlt: "Sertifikat pelatihan laser",
        order: 4,
      },
      {
        title: "Anggota PERDOSKI",
        issuer: "Perhimpunan Dokter Spesialis Kulit & Kelamin Indonesia",
        category: "Keanggotaan Profesi",
        year: "2021",
        description:
          "Keanggotaan aktif dalam organisasi profesi yang menjaga kompetensi dan etika praktik dermatologi.",
        imageUrl: img("1524995997946-a1c2e315a42f", 1200),
        imageAlt: "Kartu keanggotaan profesi",
        order: 5,
      },
    ],
  });

  console.log("   • certificates");

  // --- Facilities ---------------------------------------------------------
  await prisma.facility.createMany({
    data: [
      {
        name: "Ruang Tunggu",
        category: "Ruang Tunggu",
        description:
          "Ruang tunggu yang hangat dan tenang, dirancang agar Anda merasa nyaman sejak melangkah masuk.",
        imageUrl: img("1512290923902-8a9f81dc236c"),
        imageAlt: "Ruang tunggu AURELIA",
        gallery: [img("1631217868264-e5b90bb7e133"), img("1608248543803-ba4f8c70ae0b")],
        order: 0,
      },
      {
        name: "Ruang Konsultasi",
        category: "Ruang Konsultasi",
        description:
          "Ruang privat untuk berbincang dengan dokter — tempat setiap perawatan dimulai dari mendengarkan.",
        imageUrl: img("1556228578-8c89e6adf883"),
        imageAlt: "Ruang konsultasi dokter",
        order: 1,
      },
      {
        name: "Ruang Perawatan",
        category: "Ruang Perawatan",
        description:
          "Ruang tindakan yang bersih dan tenang, dilengkapi standar higienitas medis untuk kenyamanan dan keamanan Anda.",
        imageUrl: img("1598528738936-c50861cc75a9"),
        imageAlt: "Ruang perawatan wajah",
        gallery: [img("1608248543803-ba4f8c70ae0b"), img("1631217868264-e5b90bb7e133"), img("1512290923902-8a9f81dc236c")],
        order: 2,
      },
      {
        name: "Ruang Laser & Advanced",
        category: "Ruang Laser & Advanced",
        description:
          "Ruang khusus untuk tindakan berbasis teknologi, dengan perangkat yang terawat dan dioperasikan oleh dokter.",
        imageUrl: img("1608248543803-ba4f8c70ae0b"),
        imageAlt: "Ruang tindakan laser",
        gallery: [img("1598528738936-c50861cc75a9"), img("1512290923902-8a9f81dc236c")],
        order: 3,
      },
      {
        name: "Resepsionis",
        category: "Resepsionis",
        description:
          "Area penerimaan yang ramah untuk membantu setiap kebutuhan dan pertanyaan Anda.",
        imageUrl: img("1631217868264-e5b90bb7e133"),
        imageAlt: "Area resepsionis klinik",
        order: 4,
      },
      {
        name: "Skincare Bar",
        category: "Area Produk",
        description:
          "Rangkaian produk perawatan yang direkomendasikan dokter untuk melengkapi perawatan Anda di rumah.",
        imageUrl: img("1596755094514-f87e34085b2c"),
        imageAlt: "Etalase produk skincare",
        order: 5,
      },
    ],
  });

  console.log("   • facilities");

  // --- Reviews (approved samples) -----------------------------------------
  await prisma.review.createMany({
    data: [
      {
        author: "Larasati W.",
        treatment: "Anti Aging Program",
        rating: 5,
        body: "Pendekatannya tenang dan tidak menekan. Saya merasa benar-benar didengar, dan hasilnya terlihat natural. Ini yang membuat saya kembali.",
        approved: true,
      },
      {
        author: "Fauzan R.",
        treatment: "Laser Rejuvenation",
        rating: 5,
        body: "Sebagai laki-laki saya sempat ragu, tapi dokternya sangat informatif dan tidak berlebihan menawarkan tindakan. Tekstur kulit saya membaik bertahap.",
        approved: true,
      },
      {
        author: "Intan P.",
        treatment: "Acne Treatment",
        rating: 4,
        body: "Butuh kesabaran, tapi jerawat saya jauh berkurang dan tidak semudah dulu muncul lagi. Ruang perawatannya juga bersih dan nyaman.",
        approved: true,
      },
      {
        author: "Sabrina M.",
        treatment: "Brightening",
        rating: 5,
        body: "Kulit terlihat lebih cerah dan segar tanpa terlihat dipaksakan. Stafnya ramah dan suasananya menenangkan.",
        approved: true,
      },
      {
        author: "Gita H.",
        treatment: "Skin Barrier Repair",
        rating: 5,
        body: "Kulit saya sempat rusak karena over-exfoliate. Di sini justru diminta menyederhanakan skincare, dan perlahan pulih. Sangat jujur.",
        approved: true,
      },
    ],
  });

  console.log("   • reviews");

  // --- Media library sample ----------------------------------------------
  await prisma.media.createMany({
    data: [
      { url: img("1512290923902-8a9f81dc236c"), alt: "Interior klinik", caption: "Ruang tunggu" },
      { url: img("1598528738936-c50861cc75a9"), alt: "Ruang perawatan" },
      { url: img("1631217868264-e5b90bb7e133"), alt: "Detail interior" },
    ],
  });

  console.log("✅  Seed selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
