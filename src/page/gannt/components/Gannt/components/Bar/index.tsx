/** @format */

import React from "react";
import ReactDOM from "react-dom";
import { createSVG, TaskDetail } from "../../utils/index";
import { Popover } from "antd";
import { defaultOptions } from "../../constants";
import moment from "moment";
import "../../index.css";

interface Props {
  task: TaskDetail;
  dateRange: React.MutableRefObject<{
    ganttStart: Date | null;
    ganttEnd: Date | null;
  }>;
  columnWidth: number;
}

const Bar = ({ task, dateRange, columnWidth }: Props) => {
  const { ganttStart } = dateRange.current;
  const { step, padding, barHeight, barCornerRadius } = defaultOptions;
  const { startDate, endDate, id, index, color, detail, postponeStartDate, postponeEndDate } = task;
  const { storyPoint, summary, status, key } = detail;
console.log(postponeStartDate, postponeEndDate)
  const content = (
    <ul className="popoverContent">
      <li>
        <span className="label">Start Date</span>
        <span className="value">{moment(startDate).format("YYYY-MM-DD")}</span>
      </li>
      <li>
        <span className="label">End Date</span>
        <span className="value">{moment(endDate).format("YYYY-MM-DD")}</span>
      </li>
      <li>
        <span className="label">Status</span>
        <span className="value"> {status.name || ""}</span>
      </li>
      <li>
        <span className="label">Store Point</span>
        <span className="value"> {storyPoint || ""}</span>
      </li>
    </ul>
  );

  const title = (
    <a href={`https://www.baidu.com/browse/${key}`} target="_blank">
      {summary}
    </a>
  );

  const compute_x = (date: any) => {
    const diff = moment(date).diff(ganttStart, "hour");

    return ((diff + step) / step) * columnWidth;
  };

  const compute_y = () => {
    return padding / 2 + index * (barHeight + padding);
  };

  const duration = moment(endDate).diff(startDate, "hour") / step;
  const postponeDuration = moment(postponeEndDate).diff(postponeStartDate, "hour") / step;

  const group = createSVG("g", {
    class: "bar-wrapper",
    "data-id": id,
  });

  const temp = {
    height: barHeight,
    x: compute_x(startDate),
    y: compute_y(),
    corner_radius: barCornerRadius,
    postponeX: compute_x(postponeStartDate),
    postponeY: compute_y(),
    width: columnWidth * duration,
    postponeWidth: columnWidth * postponeDuration,
    bar_group: createSVG("g", {
      class: "bar-group",
      append_to: group,
    }),
  };
 
  
  createSVG('text', {
    x: temp.x + 15,
    y: temp.y + 15,
    innerHTML: "开始",
    class: 'lower-text',
    append_to: group,
  });
  ReactDOM.render(
    <>
        <Popover content={content} title={title} placement="bottomRight">
          <rect
            x={temp.x}
            y={temp.y}
            width={temp.width}
            height={temp.height}
            rx={temp.corner_radius}
            ry={temp.corner_radius}
            className="bar"
            fill={color}
          />
          
        
        </Popover>
        {!!postponeStartDate && <Popover content={content} title={title} placement="bottomRight">
          
          <rect
            x={temp.postponeX}
            y={temp.postponeY}
            width={temp.postponeWidth}
            height={temp.height}
            rx={temp.corner_radius}
            ry={temp.corner_radius}
            className="bar"
            fill={"red"}
          />
        
        </Popover>}
    </>
    ,
    temp.bar_group
  );

  return {
    group,
  };
};

export default Bar;
