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

  // 2. Generate Full 6-Scene Expert Script via Gemini AI
  generateExpertScript: async function(apiKey, model = 'gemini-3.6-flash', topic = '', contextObj = {}, charSnippet = '') {
    if (!apiKey) {
      return null;
    }

    const cleanModel = model.trim();
    const allowedModels = ['gemini-3.6-flash', 'gemini-3.7-flash'];
    const activeModel = allowedModels.includes(cleanModel) ? cleanModel : 'gemini-3.6-flash';

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${apiKey.trim()}`;

    const promptText = `Bạn là đạo diễn kiêm chuyên gia biên kịch video One-shot 9:16 triệu view hàng đầu trên TikTok/Reels/Shorts.
Chủ đề trình bày: "${topic}"

CÔNG THỨC THÀNH CÔNG VIRAL BẮT BUỘC (6 CẢNH - 42-48 GIÂY):
Cảnh 1 (Hook Giật Mình Viral): Đi thẳng vào một khẳng định đảo ngược suy nghĩ số đông hoặc insight nhức nhối để giữ chân người xem ở ngay 1-2 giây đầu. Tuyệt đối không dùng câu hỏi sáo rỗng.
Cảnh 2 (Bóc Tách Góc Nhìn Chuyên Gia): Phân tích thâm nhập bản chất vấn đề vì sao số đông lại dễ ngộ nhận hoặc vấp phải sai lầm.
Cảnh 3 (Chỉ Ra Điểm Mù & Hậu Quả Ngầm): Chạm tới cảm xúc đồng cảm sâu sắc, làm nổi bật nỗi đau ngầm nếu không thay đổi tư duy.
Cảnh 4 (Giải Pháp Chuyên Gia Sắc Báo): Đưa ra tư duy/hành động đảo ngược tình thế mang tính đột phá (Aha Moment!).
Cảnh 5 (Đóng Đinh Giá Trị Cốt Lõi - Quote Triệu View): Một câu chốt đắt giá truyền cảm hứng mạnh mẽ, khẳng định bản lĩnh tự chủ độc lập.
Cảnh 6 (CTA Tranh Luận Viral): Kết mở đưa ra câu hỏi/lời mời thảo luận tự nhiên gây bão bình luận phía dưới video.

QUY TẮC BẮT BUỘC VỀ LỜI THOẠI VÀ PROMPT VEO 3:
1. Lời thoại là tiếng Việt đời thường sắc bén, mang phong thái chuyên gia tự tin, truyền cảm hứng.
2. KHÓA TUYỆT ĐỐI PROMPT VEO 3:
   - KHÓA TUYỆT ĐỐI CHỮ TIẾNG VIỆT, TRANG PHỤC, NHÂN VẬT VÀ HÌNH ẢNH MẪU CỦA VIDEO GỐC: Không sai chữ, không đổi quần áo, không tự tái tạo hoặc sửa hình ảnh tham chiếu và dùng ảnh tham chiếu đó trực tiếp làm Start Frame / Ingredient.
   - Kiểm tra đầu ra và loại clip ngay khi sai!
   - Đầu prompt bắt đầu bằng: "VIDEO SẠCH, TUYỆT ĐỐI KHÔNG CHỮ. Vertical 9:16 video. Static tripod close-up medium shot looking directly into camera lens. Lock reference image directly as start frame / ingredient. STRICTLY LOCK CHARACTER FACE, OUTFIT, CLOTHING AND BACKGROUND CONTINUITY..."
   - Cuối prompt kết thúc bằng: "ABSOLUTELY NO VIETNAMESE TEXT, NO ON-SCREEN TEXT, NO SUBTITLES, NO CAPTIONS, NO LOGO, NO WATERMARK. REJECT CLIP IMMEDIATELY IF CHARACTER OUTFIT OR FACE CHANGES OR ON-SCREEN TEXT APPEARS."
   - TUYỆT ĐỐI KHÔNG NÊU MÔ TẢ TÊN, TUỔI HOẶC NGOẠI HÌNH NHÂN VẬT CỤ THỂ TRONG PROMPT VEO 3.

Yêu cầu trả về duy nhất một cấu trúc JSON như sau:
{
  "scenes": [
    {
      "sceneNum": 1,
      "goal": "Hook Giật Mình Viral (1-2s đầu)",
      "dialogue": "Lời thoại cảnh 1...",
      "expression": "Thần thái chuyên gia sắc bén, nhìn thẳng camera thu hút...",
      "startPose": "Tư thế bắt đầu cảnh 1...",
      "endPose": "Tư thế kết thúc cảnh 1...",
      "veoPrompt": "VIDEO SẠCH, TUYỆT ĐỐI KHÔNG CHỮ. Vertical 9:16 video. Static tripod close-up medium shot... Lock reference image directly as start frame / ingredient. STRICTLY LOCK CHARACTER FACE, OUTFIT, CLOTHING AND BACKGROUND CONTINUITY... ABSOLUTELY NO VIETNAMESE TEXT, NO ON-SCREEN TEXT, NO SUBTITLES, NO CAPTIONS, NO LOGO, NO WATERMARK. REJECT CLIP IMMEDIATELY IF CHARACTER OUTFIT OR FACE CHANGES OR ON-SCREEN TEXT APPEARS."
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
        temperature: 0.8,
        maxOutputTokens: 2500
      }
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) return null;

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      const cleanJson = rawText.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const parsedObj = JSON.parse(cleanJson);

      if (parsedObj && Array.isArray(parsedObj.scenes) && parsedObj.scenes.length === 6) {
        return parsedObj.scenes;
      }
      return null;
    } catch (err) {
      console.warn("Gemini Expert Script AI generation failed, fallback to local engine:", err);
      return null;
    }
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
