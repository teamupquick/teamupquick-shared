import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
  Typography,
} from "@mui/material";
import { theme } from "@shared/utils/theme";
import { useRef, useState } from "react";

const Subtitle = styled(Typography)({
  fontSize: "20px",
  fontWeight: 700,
});

const Subtitle2 = styled(Typography)({
  fontSize: "16px",
  fontWeight: 700,
});

const Text = styled(Typography)({
  fontSize: "16px",
  marginBottom: "12px",
});

interface Props {
  onClose: VoidFunction;
}

export default function DeclarationDialog(props: Props) {
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!contentRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    // 判斷是否滾動到底部或接近底部（預留10px的誤差）
    const isBottom = scrollHeight - scrollTop - clientHeight <= 10;

    if (isBottom && !hasReadToBottom) {
      setHasReadToBottom(true);
    }
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          borderRadius: "12px",
          height: "700px",
          width: "700px",
          maxWidth: "700px",
          backgroundColor: theme.colors.GN25,
        },
      }}
      open={true}
    >
      <DialogTitle sx={{ fontSize: "24px" }}>快組隊平台使用條款</DialogTitle>
      <DialogContent
        dividers={true}
        sx={{
          mx: "24px",
          border: "none",
          backgroundColor: theme.neutralWhite,
          overflowY: "auto",
        }}
        ref={contentRef}
        onScroll={handleScroll}
      >
        <Subtitle> 1. 平台與服務概述</Subtitle>
        <Text>
          快組隊股份有限公司（以下簡稱「快組隊」）提供一個由自由工作者或其他專業服務的獨立承包商（以下簡稱「人才」）所組成的網路。
        </Text>
        <Text>
          「平台」包括快組隊的網站及技術平台，旨在尋找人才並將其與需要開發、工程及其他由快組隊或透過平台提供的專業服務需求的業主（以下簡稱「客戶」）進行匹配。此外，平台還提供所有軟體、數據、報告、文字、圖像、聲音、視訊和內容（統稱為「內容」）。本平台的匹配服務幫助客戶媒合並聘用人才，提供支援與協助的服務，但不包括人才執行的任何工作。
        </Text>
        <Subtitle>2. 條款接受與變更</Subtitle>
        <Subtitle2>2.1 接受及具有法律約束力的協議</Subtitle2>
        <Text>
          透過訪問或使用快組隊平台及服務，即表示您（上述人才或客戶之個人或企業代表）已閱讀、理解並同意遵守本條款。若您是代表公司或法律實體使用本平台，您確認自己擁有使該實體受本條款約束的授權。
        </Text>
        <Subtitle2> 2.2 條款更新</Subtitle2>
        <Text>
          快組隊保留隨時更改本條款的權利。所有更改會在平台上發布，並標明更新日期。您有責任定期檢查條款變更。變更後繼續使用平台即表示您同意接受修改後的條款。
        </Text>
        <Subtitle2>2.3 註冊帳戶</Subtitle2>
        <Text>
          為使用平台，您需要創建一個帳戶並設置使用者名稱與密碼。您需對您的帳戶資訊負責，並確保其安全性。同時，您同意提供真實、準確、完整的帳戶註冊資料。
        </Text>
        <Subtitle>3. 使用限制與責任</Subtitle>
        <Subtitle2>3.1 保密義務</Subtitle2>
        <Text>
          您同意對透過平台接觸的所有專有資訊（包括但不限於業務、技術及財務資訊）保密。您不得向第三方透露或將這些資訊用於非本平台範疇之外的用途，除非依法律要求披露或有事先書面同意。您應在結束使用平台或在12個月未使用平台後，銷毀所有包含專有資訊的資料。
        </Text>
        <Subtitle2>3.2 非招攬條款</Subtitle2>
        <Text>
          在使用平台期間及結束後的12個月內，您不得直接或間接招攬或雇用任何透過平台獲知的人才，亦不得推薦該人才給您的母公司或附屬公司。
        </Text>
        <Subtitle>4. 平台使用規範</Subtitle>
        <Subtitle2>4.1 授權與使用範圍</Subtitle2>
        <Text>
          您可根據本條款授權使用平台，只能用於評估快組隊及其服務的目的。您不得用平台開發或增強其他產品或服務，或將平台內容用於商業用途，除非獲得快組隊的書面同意。
        </Text>
        <Subtitle2>4.2 所有權與限制</Subtitle2>
        <Text>
          平台的所有權及專有權利歸快組隊所有，您不得轉讓、租賃、修改、或以其他方式商業化快組隊財產，除非在法律許可範圍內或獲得書面授權。
        </Text>
        <Subtitle2>4.3 對用戶內容的責任</Subtitle2>
        <Text>
          您對自己在平台上上傳或發佈的所有內容負全責，包括但不限於任何資料、信息或創作。
        </Text>
        <Subtitle2>4.4 帳戶存取限制</Subtitle2>
        <Text>
          快組隊有權限存取您的帳戶，用於技術支援或確保您遵守本條款及其他法律要求。
        </Text>
        <Subtitle2>4.5 保留權利</Subtitle2>
        <Text>
          快組隊擁有並保留所有平台的商標、專有技術、專利及其他知識產權，您不得對平台內容進行反向工程或未經授權的存取。
        </Text>
        <Subtitle>5. 用戶內容與智慧財產權</Subtitle>
        <Subtitle2>5.1 使用者內容權利</Subtitle2>
        <Text>
          您同意對您在平台上發佈的所有內容（如訊息、資料或其他創作）授予快組隊全球範圍的非排他性使用權，以便於平台運營中使用、展示或修改此類內容。您保留對原始內容的所有權利，但授予快組隊在必要的範圍內使用該內容的權限。
        </Text>
        <Subtitle2>5.2 隱私與數據保護</Subtitle2>
        <Text>
          快組隊僅收集並使用為提供平台服務所需的個人資料，包括但不限於註冊資訊、平台使用數據及專案相關內容，這些資料僅用於提供與改進平台功能、確保平台安全運行，以及符合法律規定或授權範圍內的數據共享。快組隊承諾不會未經您的許可將個人資料分享給第三方，並採取合理措施保障您的數據安全。
        </Text>
        <Subtitle>6. 其他</Subtitle>
        <Subtitle2>6.1 適用法律</Subtitle2>
        <Text>本使用條款受台灣法律管轄，並依其解釋。</Text>
        <Subtitle2>6.2 管轄地</Subtitle2>
        <Text>
          與本條款相關的任何爭議，應提交臺北地方法院，並以台灣為唯一管轄地。
        </Text>
      </DialogContent>
      <DialogActions sx={{ height: "80px", justifyContent: "center" }}>
        <Button
          variant="outlined"
          sx={{
            borderColor: theme.text.primary,
            color: theme.text.primary,
            fontSize: "16px",
            opacity: hasReadToBottom ? 1 : 0.5,
            pointerEvents: hasReadToBottom ? "auto" : "none",
          }}
          onClick={props.onClose}
          disabled={!hasReadToBottom}
        >
          閱讀完畢
        </Button>
      </DialogActions>
    </Dialog>
  );
}
