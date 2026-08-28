/**
 * Gemini API Integration for VibeCast Studio
 * Supports Gemini 3.6 Flash & Gemini 3.7 Flash
 * Generates AI Topics & Full 6-Scene Expert Scripts
 */

const GEMINI_SERVICE = {
  // 1. Generate 5 Trending Topics
  generateTopics: async function(apiKey, model = 'gemini-3.6-flash', promptContext = '') {
    if (!apiKey) {
      throw new Error("Vui lòng nhập Gemini API Key trước khi sử dụng tính năng gợi ý AI!");
    }

    const cleanModel = model.trim();
    const allowedModels = ['gemini-3.6-flash', 'gemini-3.7-flash'];
    const activeModel = allowedModels.includes(cleanModel) ? cleanModel : 'gemini-3.6-flash';

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${apiKey.trim()}`;

    const systemPrompt = `Bạn là một biên tập viên kịch bản TikTok/Reels podcast triệu view. Hãy gợi ý 5 chủ đề & quan điểm video one-shot 9:16 hấp dẫn nhất dành cho phụ nữ hiện đại (về sự tự chủ, hôn nhân, gia đình, tình yêu, áp lực tuổi 30, sự nghiệp).
${promptContext ? `Bối cảnh/Định hướng bổ sung: ${promptContext}` : ''}
Yêu cầu trả về JSON Array chứa đúng 5 chuỗi tiêu đề ngắn gọn (dưới 15 từ), ví dụ:
[
  "Phụ nữ tự chủ tài chính không phải để tranh hơn thua với đàn ông",
  "Tuổi 30 và áp lực phải lập gia đình: Đâu là lựa chọn thực sự?",
  "Tự do cảm xúc: Đừng bắt bản thân phải nhẫn nại trong sự tổn thương",
  "Sự thấu hiểu trong hôn nhân bắt đầu từ sự tôn trọng không gian riêng",
  "Giá trị của người phụ nữ biết yêu thương bản thân đúng cách"
]`;

    const requestBody = {
      contents: [
        {
          parts: [
            { text: systemPrompt }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let msg = errorData.error?.message || `Mã lỗi HTTP ${response.status}`;
        if (response.status === 404) {
          msg = `Model '${activeModel}' chưa khả dụng trên endpoint Google AI này. Vui lòng kiểm tra lại tài khoản API Key.`;
        } else if (response.status === 400 && msg.includes('API key')) {
          msg = `Gemini API Key không hợp lệ. Vui lòng kiểm tra lại API Key.`;
        }
        throw new Error(msg);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return this.safeParseTopics(rawText);

    } catch (err) {
      console.error("Gemini API Call Error:", err);
      throw err;
    }
  },

  // 2. Generate Full 6-Scene Expert Script via Gemini AI (Content Win Formula)
  generateExpertScript: async function(apiKey, model = 'gemini-1.5-flash', topic = '') {
    if (!apiKey) {
      throw new Error("Vui lòng nhập Gemini API Key trước khi bấm tạo kịch bản AI!");
    }

    const cleanModel = model.trim();
    const allowedModels = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-3.6-flash', 'gemini-3.7-flash'];
    const activeModel = allowedModels.includes(cleanModel) ? cleanModel : 'gemini-1.5-flash';

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${apiKey.trim()}`;

    const promptText = `Bạn là Đạo diễn kiêm Master Content Creator sáng tạo video One-shot 9:16 triệu view trên TikTok/Reels/Shorts.
Nhiệm vụ của bạn: Dựa trên chủ đề "${topic}", viết một KỊCH BẢN LỜI THOẠI ĐỘC BẢN, SẮC BÉN, CỰC KỲ KHÁC BIỆT áp dụng ĐÚNG CÔNG THỨC CONTENT WIN (6 CẢNH - TỔNG THỜI LƯỢNG 42-48 GIÂY).

YÊU CẦU LỜI THOẠI ĐỘC BẢN & PHONG CÁCH CHUYÊN GIA:
1. TUYỆT ĐỐI KHÔNG DÙNG LỜI THOẠI RẬP KHUÔN HAY MẪU CÓ SẴN. Viết mới 100% lời thoại dành riêng cho chủ đề "${topic}".
2. Lời thoại là tiếng Việt đời thường sâu sắc, sắc bén, góc nhìn chuyên gia tự tin, truyền cảm hứng và đánh trúng tâm lý số đông.

CÔNG THỨC CONTENT WIN BẮT BUỘC (6 CẢNH):
- Cảnh 1 (Hook Đội Nỗi Đau & Đảo Ngược Suy Nghĩ 1-2s): Đi thẳng vào khẳng định gây bất ngờ hoặc insight nhức nhối nhất của chủ đề "${topic}". Tuyệt đối KHÔNG dùng câu hỏi sáo rỗng kiểu "Bạn có biết...", "Hôm nay...".
- Cảnh 2 (Bóc Tách Bản Chất Sai Lầm): Phân tích vì sao số đông lại vấp phải góc nhìn sai lệch hoặc điểm mù tâm lý về "${topic}".
- Cảnh 3 (Chạm Vào Nỗi Đau Ngầm): Nói đúng cảm xúc dồn nén, sự kiệt sức hoặc hậu quả nếu cứ tiếp tục đi theo lối mòn cũ.
- Cảnh 4 (Giải Pháp Đột Phá - Aha Moment): Đưa ra góc nhìn mới hoàn toàn sắc bén, giải phóng tư duy cho người nghe.
- Cảnh 5 (Đóng Đinh Giá Trị Cốt Lõi - Quote Triệu View): Một câu chốt kinh điển đắt giá, thể hiện phong thái tự chủ, bản lĩnh độc lập.
- Cảnh 6 (CTA Bão Bình Luận): Lời kết mở đưa ra góc nhìn/câu hỏi kích thích khán giả phải để lại bình luận tranh luận bên dưới.

QUY TẮC BẮT BUỘC PROMPT VEO 3:
- KHÓA TUYỆT ĐỐI CHỮ TIẾNG VIỆT, TRANG PHỤC, NHÂN VẬT VÀ HÌNH ẢNH MẪU CỦA VIDEO GỐC: Không sai chữ, không đổi quần áo, dùng ảnh tham chiếu trực tiếp làm Start Frame / Ingredient.
- Đầu veoPrompt bắt đầu: "VIDEO SẠCH, TUYỆT ĐỐI KHÔNG CHỮ. Vertical 9:16 video. Static tripod close-up medium shot looking directly into camera lens. Lock reference image directly as start frame / ingredient. STRICTLY LOCK CHARACTER FACE, OUTFIT, CLOTHING AND BACKGROUND CONTINUITY..."
- Cuối veoPrompt kết thúc: "ABSOLUTELY NO VIETNAMESE TEXT, NO ON-SCREEN TEXT, NO SUBTITLES, NO CAPTIONS, NO LOGO, NO WATERMARK. REJECT CLIP IMMEDIATELY IF CHARACTER OUTFIT OR FACE CHANGES OR ON-SCREEN TEXT APPEARS."

Trả về duy nhất cấu trúc JSON chuẩn:
{
  "scenes": [
    {
      "sceneNum": 1,
      "goal": "Hook Đội Nỗi Đau & Đảo Ngược Suy Nghĩ (1-2s)",
      "dialogue": "Lời thoại độc bản cảnh 1 sắc bén cho chủ đề...",
      "expression": "Thần thái chuyên gia sắc bén, ánh mắt xoáy sâu vào ống kính...",
      "startPose": "Tư thế bắt đầu cảnh 1...",
      "endPose": "Tư thế kết thúc cảnh 1...",
      "veoPrompt": "VIDEO SẠCH, TUYỆT ĐỐI KHÔNG CHỮ. Vertical 9:16 video. Static tripod close-up medium shot looking directly into camera lens. Lock reference image directly as start frame / ingredient. STRICTLY LOCK CHARACTER FACE, OUTFIT, CLOTHING AND BACKGROUND CONTINUITY. Looks directly into camera lens and speaks with natural lip-sync in Vietnamese: '[Nội dung câu thoại cảnh 1...]'. ABSOLUTELY NO VIETNAMESE TEXT, NO ON-SCREEN TEXT, NO SUBTITLES, NO CAPTIONS, NO LOGO, NO WATERMARK. REJECT CLIP IMMEDIATELY IF CHARACTER OUTFIT OR FACE CHANGES OR ON-SCREEN TEXT APPEARS."
    },
    ... (đủ 6 cảnh)
  ]
}`;

    const requestBody = {
      contents: [
        { parts: [{ text: promptText }] }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.85,
        maxOutputTokens: 3000
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let msg = errorData.error?.message || `Mã lỗi HTTP ${response.status}`;
      if (response.status === 400 && msg.includes('API key')) {
        msg = `Gemini API Key không hợp lệ. Vui lòng kiểm tra lại API Key.`;
      }
      throw new Error(msg);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    const cleanJson = rawText.replace(/```json/gi, '').replace(/```/gi, '').trim();
    const parsedObj = JSON.parse(cleanJson);

    if (parsedObj && Array.isArray(parsedObj.scenes) && parsedObj.scenes.length === 6) {
      return parsedObj.scenes;
    }
    throw new Error("Dữ liệu Gemini trả về không đúng cấu trúc 6 cảnh.");
  },

  // Bulletproof JSON and Line Parser
  safeParseTopics: function(rawText) {
    if (!rawText) {
      throw new Error("Gemini không trả về nội dung text.");
    }

    let cleanedText = rawText.replace(/```json/gi, '').replace(/```/gi, '').trim();

    try {
      const parsed = JSON.parse(cleanedText);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(item => String(item).replace(/^["']|["']$/g, '').trim()).filter(t => t.length > 0);
      }
    } catch (e) {
      console.warn("Standard JSON parse failed, using regex/line extractor...", e);
    }

    const arrayMatch = cleanedText.match(/\[\s*([\s\S]*?)\s*\]/);
    if (arrayMatch && arrayMatch[1]) {
      const stringMatches = arrayMatch[1].match(/"([^"\\]*(?:\\.[^"\\]*)*)"/g);
      if (stringMatches && stringMatches.length > 0) {
        return stringMatches.map(s => {
          try { return JSON.parse(s); } catch(ex) { return s.replace(/^"|"$/g, ''); }
        });
      }
    }

    const lines = cleanedText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    const extracted = [];

    for (let line of lines) {
      let item = line
        .replace(/^[\d\.\-\*\•\>\s"'\\[\\]]+/, '')
        .replace(/["'\\[\\]\,]+$/, '')
        .trim();

      if (item.length > 5 && !item.startsWith('[') && !item.startsWith(']')) {
        extracted.push(item);
      }
    }

    if (extracted.length > 0) {
      return extracted.slice(0, 5);
    }

    throw new Error("Không thể phân tích danh sách chủ đề từ kết quả Gemini.");
  }
};
