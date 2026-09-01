/**
 * Generator Engine for VibeCast Studio
 * Creates 6-scene expert storytelling scripts, voiceover text, and unique Veo 3 prompts.
 * Dynamic direct hooks - No character face descriptions in prompts.
 */

const GENERATOR_ENGINE = {
  // Context Presets
  contexts: {
    coffee: {
      name: "Quán Cà Phê Ấm Áp",
      description: "Góc quán cà phê phong cách tối giản, ánh sáng tự nhiên dịu nhẹ từ cửa kính, trên bàn có ly cà phê ấm, không gian yên tĩnh và có độ sâu hậu cảnh.",
      promptSnippet: "cozy minimal coffee shop background, soft natural lighting from large side window, warm ambient atmosphere, shallow depth of field with blurred coffee shop interior"
    },
    podcast: {
      name: "Phòng Studio Podcast",
      description: "Phòng thu podcast hiện đại với ánh sáng ấm, tường cách âm tông màu trầm, chiếc micro chuyên nghiệp trên chân đế để gần nhưng không che mặt.",
      promptSnippet: "modern podcast studio setting, warm accent lights, acoustic foam wall background, professional broadcast microphone on stand positioned near table, elegant depth"
    },
    car: {
      name: "Trong Xe Ô Tô Đỗ",
      description: "Ghế lái xe ô tô đang đỗ tĩnh tại góc phố ngập nắng dịu, góc quay nội thất xe sang trọng, không gian riêng tư và chân thật như vlog đời thường.",
      promptSnippet: "inside a stationary parked luxury car interior, soft daylight filtering through car windows, realistic intimate vlog perspective, clean car seats background"
    }
  },

  // Generate complete package based on topic and scene count
  generate: function(topic, sceneCount = 6, characterMeta = null, customVoice = '') {
    const cleanTopic = topic.trim() || "Phụ nữ tự chủ tài chính trong hôn nhân hiện đại";
    const count = parseInt(sceneCount) || 6;

    // Build unique expert scenes & reference image prompt (no character description)
    const scenesData = this.buildExpertScenes(cleanTopic, count);
    const refImagePrompt = this.buildRefImagePrompt();
    const fullText = scenesData.map(s => s.dialogue).join(" ");
    
    return {
      topic: cleanTopic,
      voiceSpec: customVoice || "Giọng Nam chuyên gia (25-28 tuổi), phát âm chuẩn, trầm ấm, rõ chữ, phong thái tự tin và truyền cảm hứng",
      fullSpeech: fullText,
      totalDuration: `${Math.round(scenesData.length * 7.5)} giây (${scenesData.length} cảnh × 7.5 giây)`,
      refImagePrompt: refImagePrompt,
      scenes: scenesData
    };
  },

  // Build Reference Image Prompt (Midjourney / FLUX / Imagen 3 / DALL-E 3)
  buildRefImagePrompt: function() {
    return `Vertical 9:16 portrait photograph. Medium close-up shot facing directly into camera lens. Soft natural cinematic lighting, detailed texture, professional studio photography, 8k resolution, photorealistic, sharp focus. ABSOLUTELY NO TEXT, NO LOGO, NO WATERMARK, NO SUBTITLES. --ar 9:16`;
  },

  // Generate dynamic expert scripts & unique Veo 3 prompts
  buildExpertScenes: function(topic, sceneCount = 6) {
    const count = parseInt(sceneCount) || 6;
    const topicLower = topic.toLowerCase();

    // Categorize topic to generate tailored expert hooks & insights
    let category = "general";
    if (topicLower.includes("tài chính") || topicLower.includes("tiền") || topicLower.includes("độc lập") || topicLower.includes("tự chủ")) {
      category = "finance";
    } else if (topicLower.includes("tuổi 30") || topicLower.includes("áp lực") || topicLower.includes("khủng hoảng") || topicLower.includes("sự nghiệp")) {
      category = "career_age";
    } else if (topicLower.includes("hôn nhân") || topicLower.includes("tình yêu") || topicLower.includes("thấu hiểu") || topicLower.includes("vợ chồng")) {
      category = "relationship";
    } else if (topicLower.includes("cảm xúc") || topicLower.includes("tổn thương") || topicLower.includes("bản thân") || topicLower.includes("tự do")) {
      category = "emotion_growth";
    }

    let scenes = [];

    if (category === "finance") {
      scenes = [
        {
          sceneNum: 1,
          goal: "Hook Giật Mình Viral (1-2s đầu)",
          dialogue: `Rất nhiều người nhầm tưởng tự chủ tài chính là để tranh hơn thua. Thực tế hoàn toàn ngược lại: tiền không mua được hạnh phúc, nhưng cho bạn quyền tự do lựa chọn.`,
          expression: "Ánh mắt điềm tĩnh, nhìn thẳng camera với phong thái chuyên gia sắc bén.",
          startPose: "Khoanh tay tự nhiên, ngực hơi tựa nhẹ về phía trước.",
          endPose: "Thả tay trái xuống bàn, tay phải nâng nhẹ ngón tay nhấn mạnh.",
          veoPrompt: `VIDEO SẠCH, TUYỆT ĐỐI KHÔNG CHỮ. Vertical 9:16 video. Static tripod close-up medium shot sitting confidently. Lock reference image directly as start frame / ingredient. STRICTLY LOCK CHARACTER FACE, OUTFIT, CLOTHING AND BACKGROUND CONTINUITY. Looks directly into camera lens and speaks with natural lip-sync in Vietnamese: 'Rất nhiều người nhầm tưởng tự chủ tài chính là để tranh hơn thua...'. ABSOLUTELY NO VIETNAMESE TEXT, NO ON-SCREEN TEXT, NO SUBTITLES, NO CAPTIONS, NO LOGO, NO WATERMARK. REJECT CLIP IMMEDIATELY IF CHARACTER OUTFIT OR FACE CHANGES OR ON-SCREEN TEXT APPEARS.`
        },
        {
          sceneNum: 2,
          goal: "Bóc tách bản chất vấn đề",
          dialogue: `Khi bạn không phụ thuộc kinh tế vào bất kỳ ai, mọi quyết định của bạn trong mối quan hệ đều xuất phát từ sự tự nguyện và yêu thương chân thành.`,
          expression: "Nụ cười nhẹ tự tin, gật đầu khẳng định.",
          startPose: "Hai tay đặt trên bàn, bàn tay mở nhẹ hướng về phía camera.",
          endPose: "Đan nhẹ các ngón tay lại với nhau, nghiêng đầu 5 độ.",
          veoPrompt: `VIDEO SẠCH, TUYỆT ĐỐI KHÔNG CHỮ. Vertical 9:16 video. Seamless continuation shot. Lock reference image directly as start frame / ingredient. STRICTLY LOCK CHARACTER FACE, OUTFIT AND CLOTHING. Speaks calmly with realistic lip sync: 'Khi bạn không phụ thuộc kinh tế vào bất kỳ ai, mọi quyết định của bạn đều xuất phát từ sự tự nguyện...'. ABSOLUTELY NO VIETNAMESE TEXT, NO ON-SCREEN TEXT, NO SUBTITLES, NO CAPTIONS, NO LOGO, NO WATERMARK. REJECT CLIP IMMEDIATELY IF CHARACTER OUTFIT OR FACE CHANGES OR ON-SCREEN TEXT APPEARS.`
        },
        {
          sceneNum: 3,
          goal: "Chỉ ra sai lầm phổ biến",
          dialogue: `Sự phụ thuộc lâu ngày sẽ vô tình biến sự hy sinh thành điều hiển nhiên, và dần bào mòn sự tôn trọng giữa hai người.`,
          expression: "Biểu cảm trầm ngâm, ánh mắt đồng cảm sâu sắc.",
          startPose: "Giữ tay đan nhẹ, nét mặt nghiêm túc.",
          endPose: "Hơi thả lỏng vai, ánh mắt xoáy sâu vào ống kính.",
          veoPrompt: `VIDEO SẠCH, TUYỆT ĐỐI KHÔNG CHỮ. Vertical 9:16 video. Continuous camera perspective speaking directly to audience: 'Sự phụ thuộc lâu ngày sẽ vô tình biến sự hy sinh thành điều hiển nhiên...'. Lock reference image directly as start frame / ingredient. STRICTLY LOCK CHARACTER FACE, OUTFIT AND CLOTHING. ABSOLUTELY NO VIETNAMESE TEXT, NO ON-SCREEN TEXT, NO SUBTITLES, NO CAPTIONS, NO LOGO, NO WATERMARK. REJECT CLIP IMMEDIATELY IF CHARACTER OUTFIT OR FACE CHANGES OR ON-SCREEN TEXT APPEARS.`
        },
        {
          sceneNum: 4,
          goal: "Định hướng giải pháp chuyên gia",
          dialogue: `Tự chủ tài chính chưa bao giờ là mất đi sự dịu dàng. Đó là tấm lá chắn bảo vệ sự bình yên cho chính bạn và gia đình trước mọi biến cố.`,
          expression: "Thần thái kiên định, nụ cười ấm áp truyền năng lượng tích cực.",
          startPose: "Mở rộng hai tay nhẹ nhàng.",
          endPose: "Thu một tay về ngực, gật đầu dứt khoát.",
          veoPrompt: `VIDEO SẠCH, TUYỆT ĐỐI KHÔNG CHỮ. Vertical 9:16 video. Match cut continuation, speaking with warm posture: 'Tự chủ tài chính chưa bao giờ là mất đi sự dịu dàng. Đó là tấm lá chắn bảo vệ sự bình yên...'. Lock reference image directly as start frame / ingredient. STRICTLY LOCK CHARACTER FACE, OUTFIT AND CLOTHING. ABSOLUTELY NO VIETNAMESE TEXT, NO ON-SCREEN TEXT, NO SUBTITLES, NO CAPTIONS, NO LOGO, NO WATERMARK. REJECT CLIP IMMEDIATELY IF CHARACTER OUTFIT OR FACE CHANGES OR ON-SCREEN TEXT APPEARS.`
        },
        {
          sceneNum: 5,
          goal: "Giá trị cốt lõi đắt giá",
          dialogue: `Một người làm chủ được cuộc đời mình sẽ luôn tạo ra trường năng lượng tích cực và sự chủ động trong mọi hoàn cảnh.`,
          expression: "Nét mặt sáng rỡ, ánh mắt truyền cảm hứng mạnh mẽ.",
          startPose: "Đặt tay lên bàn, thân người hơi hướng về camera.",
          endPose: "Thả lỏng hai tay, mỉm cười tự nhiên.",
          veoPrompt: `VIDEO SẠCH, TUYỆT ĐỐI KHÔNG CHỮ. Vertical 9:16 video. Continuation shot speaking in Vietnamese: 'Một người làm chủ được cuộc đời mình sẽ luôn tạo ra trường năng lượng tích cực...'. Lock reference image directly as start frame / ingredient. STRICTLY LOCK CHARACTER FACE, OUTFIT AND CLOTHING. ABSOLUTELY NO VIETNAMESE TEXT, NO ON-SCREEN TEXT, NO SUBTITLES, NO CAPTIONS, NO LOGO, NO WATERMARK. REJECT CLIP IMMEDIATELY IF CHARACTER OUTFIT OR FACE CHANGES OR ON-SCREEN TEXT APPEARS.`
        },
        {
          sceneNum: 6,
          goal: "Kết mở & Kêu gọi tương tác",
          dialogue: `Quan điểm của bạn thế nào về sự tự chủ trong cuộc sống hôm nay? Hãy chia sẻ suy nghĩ của bạn bên dưới nhé!`,
          expression: "Nụ cười rạng rỡ, ánh mắt lắng nghe chân thành.",
          startPose: "Nghiêng đầu nhẹ, hai tay đặt tự nhiên trên bàn.",
          endPose: "Giữ nụ cười ấm áp, nhìn thẳng camera 1 giây sau khi nói xong.",
          veoPrompt: `VIDEO SẠCH, TUYỆT ĐỐI KHÔNG CHỮ. Vertical 9:16 video. Final scene of 6-part video. Lock reference image directly as start frame / ingredient. STRICTLY LOCK CHARACTER FACE, OUTFIT AND CLOTHING. Finishes speaking with an inviting smile: 'Quan điểm của bạn thế nào về sự tự chủ trong cuộc sống hôm nay? Hãy chia sẻ suy nghĩ của bạn...'. ABSOLUTELY NO VIETNAMESE TEXT, NO ON-SCREEN TEXT, NO SUBTITLES, NO CAPTIONS, NO LOGO, NO WATERMARK. REJECT CLIP IMMEDIATELY IF CHARACTER OUTFIT OR FACE CHANGES OR ON-SCREEN TEXT APPEARS.`
        }
      ];
    } else if (category === "career_age") {
      scenes = [
        {
          sceneNum: 1,
          goal: "Hook trực diện & Khẳng định ngầm hiểu",
          dialogue: `Khủng hoảng tuổi 30 chưa bao giờ đến từ con số tuổi tác. Nó đến từ việc bạn cố áp đặt cột mốc của người khác lên cuộc đời mình.`,
          expression: "Nhìn thẳng camera với ánh mắt sâu sắc của người từng trải.",
          startPose: "Khoanh tay tĩnh tại, tựa lưng nhẹ vào ghế.",
          endPose: "Thả tay xuống bàn, nghiêng nhẹ người về phía trước.",
          veoPrompt: `VIDEO SẠCH, TUYỆT ĐỐI KHÔNG CHỮ. Vertical 9:16 video. Medium close-up sitting confidently. Lock reference image directly as start frame / ingredient. STRICTLY LOCK CHARACTER FACE, OUTFIT AND CLOTHING. Speaks with strong presence in Vietnamese: 'Khủng hoảng tuổi 30 chưa bao giờ đến từ con số tuổi tác...'. ABSOLUTELY NO VIETNAMESE TEXT, NO ON-SCREEN TEXT, NO SUBTITLES, NO CAPTIONS, NO LOGO, NO WATERMARK. REJECT CLIP IMMEDIATELY IF CHARACTER OUTFIT OR FACE CHANGES OR ON-SCREEN TEXT APPEARS.`
        },
        {
          sceneNum: 2,
          goal: "Bóc tách góc nhìn chuyên gia",
          dialogue: `Xã hội dạy chúng ta phải ổn định trước tuổi 30, nhưng lại không dạy chúng ta cách lắng nghe giá trị thực sự bên trong mình.`,
          expression: "Nét mặt trầm tĩnh, gật đầu nhẹ.",
          startPose: "Một tay chạm nhẹ ngực, tay kia trên bàn.",
          endPose: "Mở hai tay ra hai bên.",
          veoPrompt: `VIDEO SẠCH, TUYỆT ĐỐI KHÔNG CHỮ. Vertical 9:16 video. Seamless scene match speaking in Vietnamese: 'Xã hội dạy chúng ta phải ổn định trước tuổi 30, nhưng lại không dạy chúng ta cách lắng nghe...'. Lock reference image directly as start frame / ingredient. STRICTLY LOCK CHARACTER FACE, OUTFIT AND CLOTHING. ABSOLUTELY NO VIETNAMESE TEXT, NO ON-SCREEN TEXT, NO SUBTITLES, NO CAPTIONS, NO LOGO, NO WATERMARK. REJECT CLIP IMMEDIATELY IF CHARACTER OUTFIT OR FACE CHANGES OR ON-SCREEN TEXT APPEARS.`
        },
        {
          sceneNum: 3,
          goal: "Chỉ ra mâu thuẫn cảm xúc",
          dialogue: `Chạy theo một tiêu chuẩn không thuộc về mình chỉ khiến bạn chạm tới cái gọi là 'thành công' trong sự kiệt sức và trống rỗng.`,
          expression: "Ánh mắt điềm tĩnh nhưng chứa đựng sự thấu hiểu sâu sắc.",
          startPose: "Bàn tay nắm nhẹ trên bàn.",
          endPose: "Mở lòng bàn tay, thở nhẹ tự nhiên.",
          veoPrompt: `VIDEO SẠCH, TUYỆT ĐỐI KHÔNG CHỮ. Vertical 9:16 video. Continuous setup speaking warmly: 'Chạy theo một tiêu chuẩn không thuộc về mình chỉ khiến bạn chạm tới cái gọi là thành công trong sự trống rỗng...'. Lock reference image directly as start frame / ingredient. STRICTLY LOCK CHARACTER FACE, OUTFIT AND CLOTHING. ABSOLUTELY NO VIETNAMESE TEXT, NO ON-SCREEN TEXT, NO SUBTITLES, NO CAPTIONS, NO LOGO, NO WATERMARK. REJECT CLIP IMMEDIATELY IF CHARACTER OUTFIT OR FACE CHANGES OR ON-SCREEN TEXT APPEARS.`
        },
        {
          sceneNum: 4,
          goal: "Định hướng giải pháp",
          dialogue: `Thành công thực sự ở tuổi 30 không phải là có bao nhiêu tài sản, mà là bạn có đủ bản lĩnh sống đúng với lựa chọn của chính mình hay không.`,
          expression: "Thần thái tự tin, nụ cười kiên định.",
          startPose: "Ngồi thẳng lưng, hai tay đặt vững trên bàn.",
          endPose: "Nhìn thẳng vào ống kính, gật đầu khẳng định.",
          veoPrompt: `VIDEO SẠCH, TUYỆT ĐỐI KHÔNG CHỮ. Vertical 9:16 video. Professional shot speaking: 'Thành công thực sự ở tuổi 30 không phải là có bao nhiêu tài sản, mà là bạn có đủ bản lĩnh...'. Lock reference image directly as start frame / ingredient. STRICTLY LOCK CHARACTER FACE, OUTFIT AND CLOTHING. ABSOLUTELY NO VIETNAMESE TEXT, NO ON-SCREEN TEXT, NO SUBTITLES, NO CAPTIONS, NO LOGO, NO WATERMARK. REJECT CLIP IMMEDIATELY IF CHARACTER OUTFIT OR FACE CHANGES OR ON-SCREEN TEXT APPEARS.`
        },
        {
          sceneNum: 5,
          goal: "Giá trị cốt lõi đắt giá",
          dialogue: `Mỗi người đều có một múi giờ phát triển riêng. Chậm lại một chút để đi đúng hướng luôn tốt hơn là lao nhanh trên con đường sai.`,
          expression: "Ánh mắt tràn đầy năng lượng tích cực và sự bao dung.",
          startPose: "Một tay giơ nhẹ nhịp theo lời nói.",
          endPose: "Thu tay về bàn, mỉm cười dịu dàng.",
          veoPrompt: `VIDEO SẠCH, TUYỆT ĐỐI KHÔNG CHỮ. Vertical 9:16 video. Continuous video stream speaking smoothly: 'Mỗi người đều có một múi giờ phát triển riêng. Chậm lại một chút để đi đúng hướng...'. Lock reference image directly as start frame / ingredient. STRICTLY LOCK CHARACTER FACE, OUTFIT AND CLOTHING. ABSOLUTELY NO VIETNAMESE TEXT, NO ON-SCREEN TEXT, NO SUBTITLES, NO CAPTIONS, NO LOGO, NO WATERMARK. REJECT CLIP IMMEDIATELY IF CHARACTER OUTFIT OR FACE CHANGES OR ON-SCREEN TEXT APPEARS.`
        },
        {
          sceneNum: 6,
          goal: "Kết mở & Kêu gọi tương tác",
          dialogue: `Bạn đang ở giai đoạn nào trên hành trình của mình? Hãy để lại một lời nhắn cho chính bản thân bạn ở bên dưới nhé!`,
          expression: "Nụ cười rạng rỡ, thần thái ấm áp.",
          startPose: "Thả lỏng vai, hai tay đặt tự nhiên trên bàn.",
          endPose: "Mỉm cười nhìn thẳng camera 1s sau khi thoại.",
          veoPrompt: `VIDEO SẠCH, TUYỆT ĐỐI KHÔNG CHỮ. Vertical 9:16 video. Final 6th scene finishes speaking with an encouraging smile: 'Bạn đang ở giai đoạn nào trên hành trình của mình? Hãy để lại một lời nhắn...'. Lock reference image directly as start frame / ingredient. STRICTLY LOCK CHARACTER FACE, OUTFIT AND CLOTHING. ABSOLUTELY NO VIETNAMESE TEXT, NO ON-SCREEN TEXT, NO SUBTITLES, NO CAPTIONS, NO LOGO, NO WATERMARK. REJECT CLIP IMMEDIATELY IF CHARACTER OUTFIT OR FACE CHANGES OR ON-SCREEN TEXT APPEARS.`
        }
      ];
    } else {
      // General Expert Storytelling tailored to the user's specific topic input
      scenes = [
        {
          sceneNum: 1,
          goal: "Hook trực diện đi thẳng vào câu chuyện",
          dialogue: `Sai lầm lớn nhất của chúng ta khi nhìn nhận về '${topic}' là đánh giá nó qua cái nhìn của số đông thay vì hiểu đúng bản chất bên trong.`,
          expression: "Thần thái chuyên gia sắc bén, nhìn thẳng ống kính thu hút khán giả ngay lập tức.",
          startPose: "Ngồi thẳng tự nhiên, hai tay đặt nhẹ trên bàn.",
          endPose: "Nghiêng đầu nhẹ, hai mắt xoáy sâu vào camera.",
          veoPrompt: `VIDEO SẠCH, TUYỆT ĐỐI KHÔNG CHỮ. Vertical 9:16 video. Close-up medium shot. Speaks with authoritative tone in Vietnamese: 'Sai lầm lớn nhất của chúng ta khi nhìn nhận về ${topic} là đánh giá nó qua cái nhìn của số đông...'. Lock reference image directly as start frame / ingredient. STRICTLY LOCK CHARACTER FACE, OUTFIT AND CLOTHING. ABSOLUTELY NO VIETNAMESE TEXT, NO ON-SCREEN TEXT, NO SUBTITLES, NO CAPTIONS, NO LOGO, NO WATERMARK. REJECT CLIP IMMEDIATELY IF CHARACTER OUTFIT OR FACE CHANGES OR ON-SCREEN TEXT APPEARS.`
        },
        {
          sceneNum: 2,
          goal: "Bóc tách góc nhìn chiều sâu",
          dialogue: `Khi bạn quan sát đủ sâu, bạn sẽ nhận ra mọi mâu thuẫn hay áp lực trong cuộc sống đều bắt nguồn từ sự thiếu thấu hiểu giá trị bản thân.`,
          expression: "Trầm tĩnh, gật đầu nhẹ để khẳng định lập luận.",
          startPose: "Một tay mở nhẹ hướng về phía người xem.",
          endPose: "Đưa tay về đan nhẹ trên bàn.",
          veoPrompt: `VIDEO SẠCH, TUYỆT ĐỐI KHÔNG CHỮ. Vertical 9:16 video. Seamless continuation speaking: 'Khi bạn quan sát đủ sâu, bạn sẽ nhận ra mọi mâu thuẫn hay áp lực...'. Lock reference image directly as start frame / ingredient. STRICTLY LOCK CHARACTER FACE, OUTFIT AND CLOTHING. ABSOLUTELY NO VIETNAMESE TEXT, NO ON-SCREEN TEXT, NO SUBTITLES, NO CAPTIONS, NO LOGO, NO WATERMARK. REJECT CLIP IMMEDIATELY IF CHARACTER OUTFIT OR FACE CHANGES OR ON-SCREEN TEXT APPEARS.`
        },
        {
          sceneNum: 3,
          goal: "Chỉ ra mâu thuẫn & Điểm mù",
          dialogue: `Chúng ta thường cố gắng thay đổi hoàn cảnh bên ngoài, nhưng lại quên mất rằng tư duy mới là thứ quyết định phản ứng của bạn.`,
          expression: "Nét mặt suy ngẫm, ánh mắt chân thành.",
          startPose: "Giữ hai tay trên bàn, vai thả lỏng.",
          endPose: "Hơi nâng cằm nhẹ, ánh mắt kiên định.",
          veoPrompt: `VIDEO SẠCH, TUYỆT ĐỐI KHÔNG CHỮ. Vertical 9:16 video. Static tripod shot speaking directly to camera: 'Chúng ta thường cố gắng thay đổi hoàn cảnh bên ngoài, nhưng lại quên mất rằng tư duy mới là thứ quyết định...'. Lock reference image directly as start frame / ingredient. STRICTLY LOCK CHARACTER FACE, OUTFIT AND CLOTHING. ABSOLUTELY NO VIETNAMESE TEXT, NO ON-SCREEN TEXT, NO SUBTITLES, NO CAPTIONS, NO LOGO, NO WATERMARK. REJECT CLIP IMMEDIATELY IF CHARACTER OUTFIT OR FACE CHANGES OR ON-SCREEN TEXT APPEARS.`
        },
        {
          sceneNum: 4,
          goal: "Đưa ra giải pháp chuyên gia",
          dialogue: `Thay vì chống lại những điều không thể kiểm soát, hãy tập trung xây dựng nội lực và sự bình tĩnh từ chính bên trong mình.`,
          expression: "Ánh mắt ấm áp, nụ cười nhẹ truyền niềm tin.",
          startPose: "Đặt tay lên ngực trái nhẹ nhàng.",
          endPose: "Mở tay ra phía trước tự nhiên.",
          veoPrompt: `VIDEO SẠCH, TUYỆT ĐỐI KHÔNG CHỮ. Vertical 9:16 video. Continuation cut speaking with warm confidence: 'Thay vì chống lại những điều không thể kiểm soát, hãy tập trung xây dựng nội lực...'. Lock reference image directly as start frame / ingredient. STRICTLY LOCK CHARACTER FACE, OUTFIT AND CLOTHING. ABSOLUTELY NO VIETNAMESE TEXT, NO ON-SCREEN TEXT, NO SUBTITLES, NO CAPTIONS, NO LOGO, NO WATERMARK. REJECT CLIP IMMEDIATELY IF CHARACTER OUTFIT OR FACE CHANGES OR ON-SCREEN TEXT APPEARS.`
        },
        {
          sceneNum: 5,
          goal: "Tóm gọn giá trị đắt giá",
          dialogue: `Sự trưởng thành thật sự là khi bạn tìm thấy sự bình an ngay giữa những biến động, và sống một cuộc đời độc lập, có giá trị.`,
          expression: "Thần thái sang trọng, nụ cười dịu dàng tự tin.",
          startPose: "Ngồi tựa lưng thoải mái, tay đặt trên bàn.",
          endPose: "Gật đầu dứt khoát, nụ cười tươi nhẹ.",
          veoPrompt: `VIDEO SẠCH, TUYỆT ĐỐI KHÔNG CHỮ. Vertical 9:16 video. Seamless continuous shot speaking warmly: 'Sự trưởng thành thật sự là khi bạn tìm thấy sự bình an ngay giữa những biến động...'. Lock reference image directly as start frame / ingredient. STRICTLY LOCK CHARACTER FACE, OUTFIT AND CLOTHING. ABSOLUTELY NO VIETNAMESE TEXT, NO ON-SCREEN TEXT, NO SUBTITLES, NO CAPTIONS, NO LOGO, NO WATERMARK. REJECT CLIP IMMEDIATELY IF CHARACTER OUTFIT OR FACE CHANGES OR ON-SCREEN TEXT APPEARS.`
        },
        {
          sceneNum: 6,
          goal: "Kết mở & Kêu gọi thảo luận",
          dialogue: `Góc nhìn của bạn thế nào về vấn đề này? Hãy để lại bình luận phía dưới để chúng ta cùng trao đổi nhé!`,
          expression: "Nụ cười rạng rỡ lắng nghe, ánh mắt thân thiện.",
          startPose: "Nghiêng đầu nhẹ sang một bên.",
          endPose: "Giữ ánh mắt nhìn thẳng camera 1s sau khi kết thúc câu thoại.",
          veoPrompt: `VIDEO SẠCH, TUYỆT ĐỐI KHÔNG CHỮ. Vertical 9:16 video. Final 6th scene finishes speaking with an inviting smile: 'Góc nhìn của bạn thế nào về vấn đề này? Hãy để lại bình luận phía dưới...'. Lock reference image directly as start frame / ingredient. STRICTLY LOCK CHARACTER FACE, OUTFIT AND CLOTHING. ABSOLUTELY NO VIETNAMESE TEXT, NO ON-SCREEN TEXT, NO SUBTITLES, NO CAPTIONS, NO LOGO, NO WATERMARK. REJECT CLIP IMMEDIATELY IF CHARACTER OUTFIT OR FACE CHANGES OR ON-SCREEN TEXT APPEARS.`
        }
      ];
    }

    if (scenes.length > count) {
      const hook = scenes[0];
      const cta = scenes[scenes.length - 1];
      const middle = scenes.slice(1, count - 1);
      scenes = [hook, ...middle, cta];
    } else if (scenes.length < count) {
      while (scenes.length < count) {
        const lastMid = scenes[scenes.length - 2] || scenes[0];
        scenes.splice(scenes.length - 1, 0, { ...lastMid });
      }
    }

    return scenes.map((sc, idx) => ({
      ...sc,
      sceneNum: idx + 1
    }));
  }
};
