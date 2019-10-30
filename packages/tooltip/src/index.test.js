import React from "react";
import { LEAVE_TIMEOUT, MOUSE_REST_TIMEOUT } from ".";

let Tooltip;
let render, fireEvent, act, cleanup;

describe("Tooltip", () => {
  beforeEach(() => {
    ({ default: Tooltip } = require("."));
    ({ cleanup, render, fireEvent, act } = require("@testing-library/react"));

    jest.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
  });

  it("shows/hides on hover", () => {
    const { baseElement, getByText } = render(
      <Tooltip label="Content">
        <button>Trigger</button>
      </Tooltip>
    );
    const trigger = getByText("Trigger");

    expect(baseElement).toMatchSnapshot();
    fireEvent.mouseOver(trigger);
    act(() => jest.advanceTimersByTime(MOUSE_REST_TIMEOUT));
    expect(baseElement).toMatchSnapshot();
    fireEvent.mouseLeave(trigger);
    act(() => jest.advanceTimersByTime(LEAVE_TIMEOUT));
    expect(baseElement).toMatchSnapshot();
  });

  it("shows/hides when trigger is activeElement", () => {
    const { baseElement, getByText } = render(
      <Tooltip label="Content">
        <button>Trigger</button>
      </Tooltip>
    );
    const trigger = getByText("Trigger");

    expect(baseElement).toMatchSnapshot();
    fireEvent.focus(trigger);
    expect(baseElement).toMatchSnapshot();
    fireEvent.blur(trigger);
    act(() => jest.advanceTimersByTime(LEAVE_TIMEOUT));
    expect(baseElement).toMatchSnapshot();
  });

  it("shows without timeout when one tooltip is already visible", () => {
    const { baseElement, getByText } = render(
      <>
        <Tooltip label="First">
          <button>First Trigger</button>
        </Tooltip>
        <Tooltip label="Second">
          <button>Second Trigger</button>
        </Tooltip>
      </>
    );
    const firstTrigger = getByText("First Trigger");
    const secondTrigger = getByText("Second Trigger");

    fireEvent.mouseOver(firstTrigger);
    act(() => jest.advanceTimersByTime(MOUSE_REST_TIMEOUT));
    expect(baseElement).toMatchSnapshot();
    fireEvent.mouseLeave(firstTrigger);
    fireEvent.mouseOver(secondTrigger);
    expect(baseElement).toMatchSnapshot();
  });

  it("hides on ESC", () => {
    const { baseElement, getByText } = render(
      <Tooltip label="Content">
        <button>Trigger</button>
      </Tooltip>
    );

    const trigger = getByText("Trigger");
    fireEvent.focus(trigger);
    act(() => jest.advanceTimersByTime(MOUSE_REST_TIMEOUT));
    expect(baseElement).toMatchSnapshot();
    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(baseElement).toMatchSnapshot();
  });
});
