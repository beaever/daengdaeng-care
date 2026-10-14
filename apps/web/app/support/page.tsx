import type { Metadata } from 'next';
import { DocPage } from '../../components/DocPage';
import { contactEmail } from '../../lib/content';

export const metadata: Metadata = {
  title: '고객 지원 — 댕댕케어',
  alternates: { canonical: '/support' },
};

// App Store 지원 URL.
export default function SupportPage() {
  return (
    <DocPage title="고객 지원">
      <p>
        궁금한 점이나 오류는 <a href={`mailto:${contactEmail}`}>{contactEmail}</a> 로 보내 주세요. 사용 중인 iPhone
        기종과 iOS 버전을 함께 적어 주시면 빠르게 확인할 수 있어요.
      </p>

      <h2>자주 묻는 질문</h2>

      <h3>증상 체크 결과를 믿어도 되나요?</h3>
      <p>
        증상 체크와 음식 판별은 참고용 정보이며 수의사의 진단을 대신하지 않습니다. 이상 증상이 있거나 응급
        상황으로 의심되면 바로 동물병원에 방문하세요.
      </p>

      <h3>위치 권한을 허용하지 않으면 병원을 찾을 수 없나요?</h3>
      <p>지역명(예: 강남역)을 입력하면 그 주변 동물병원을 찾을 수 있어요.</p>

      <h3>병원 정보가 실제와 달라요.</h3>
      <p>병원 정보는 카카오 장소 검색 결과입니다. 방문 전에 전화로 진료 여부를 확인해 주세요.</p>

      <h3>기록을 다른 기기로 옮기거나 백업할 수 있나요?</h3>
      <p>
        지금은 모든 기록이 기기 안에만 저장되며, 백업·이전 기능은 없습니다. 앱을 삭제하면 기록도 함께 삭제되니
        주의해 주세요.
      </p>

      <p>
        <a href="/privacy">개인정보처리방침</a>
      </p>
    </DocPage>
  );
}
