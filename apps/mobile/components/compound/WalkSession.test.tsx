import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { WalkSession, formatElapsed } from './WalkSession';

const noop = jest.fn();
const controls = <WalkSession.Controls onPause={noop} onResume={noop} onEnd={noop} />;

describe('WalkSession.Controls', () => {
  it('recording: 일시정지·종료', async () => {
    const { getByText, queryByText } = await render(<WalkSession phase="recording">{controls}</WalkSession>);
    expect(getByText('일시정지')).toBeTruthy();
    expect(getByText('종료')).toBeTruthy();
    expect(queryByText('재개')).toBeNull();
  });

  it('paused: 재개·종료, 재개 탭 시 onResume', async () => {
    const onResume = jest.fn();
    const { getByText, queryByText } = await render(
      <WalkSession phase="paused">
        <WalkSession.Controls onPause={noop} onResume={onResume} onEnd={noop} />
      </WalkSession>
    );
    expect(queryByText('일시정지')).toBeNull();
    await fireEvent.press(getByText('재개'));
    expect(onResume).toHaveBeenCalled();
  });

  it('finished: 컨트롤은 없고 Finish 만 보인다', async () => {
    const { queryByText, getByText } = await render(
      <WalkSession phase="finished">
        {controls}
        <WalkSession.Finish minutes={5} distanceM={400} points={[]} photo={null} onPickPhoto={noop}
          notes="" onChangeNotes={noop} onSave={noop} onDiscard={noop} />
      </WalkSession>
    );
    expect(queryByText('종료')).toBeNull();
    expect(getByText('저장하기')).toBeTruthy();
  });
});

it('formatElapsed', () => {
  expect(formatElapsed(65_000)).toBe('01:05');
  expect(formatElapsed(3_725_000)).toBe('1:02:05');
});
