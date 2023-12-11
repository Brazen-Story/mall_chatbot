// global.d.ts
declare global {
    interface FaqResult {
      message_id: number;
      question?: string;
      answer?: string;
      image_1?: string | null;
      image_2?: string | null;
    }
  
    interface FaqAnswer {
      answer?: string;
      image_1?: string | null;
      image_2?: string | null;
    }

    interface FaqQuestion {
        message_id: number;
        question?: string;
        answer?: string;
        image_1?: string | null;
        image_2?: string | null;
      }  
    
  }
  
  // 아래 내용을 추가해주어야 다른 파일에서도 해당 global 타입들을 사용할 수 있습니다.
  export {};
  