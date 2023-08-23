import { useEffect, useState, useRef } from 'react';
import { getMissionById } from '../Mission/Edit';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { SVG } from '@svgdotjs/svg.js';
import { IMission, IMissionAssets, MissionAssetType } from '@types';
import { GG_LINK_FILE } from '@constants';

const getDefectOffset = (e: any, image: HTMLImageElement) => {
  const rect = e.currentTarget.getBoundingClientRect(),
    offsetX = e.clientX - rect.left,
    offsetY = e.clientY - rect.top;
  const x = (image.naturalWidth / image.clientWidth) * offsetX;
  const y = (image.naturalHeight / image.clientHeight) * offsetY;
  return [x, y];
};

let svg = SVG('#svg');

export function MissionActivities(props) {
  const imgRef: any = useRef();
  const [scale, setScale] = useState<number>(1);
  useEffect(() => {
    getMissionById(props.params.id, () => {});
  }, []);

  if (!props.reduxStates['mission->get-by-id']?.data?.data) return;

  const mission: IMission = props.reduxStates['mission->get-by-id']?.data?.data;
  const cloudId =
    mission.Assets.find(
      (assets: IMissionAssets) => assets.type === MissionAssetType.IMAGE,
    )?.Asset?.cloudId || '';

  const onImageLoaded = (e: any) => {
    const nW = e.target.naturalWidth;
    const nH = e.target.naturalHeight;
    svg = SVG('#svg');

    svg.size(nW, nH).viewbox(0, 0, nW, nH);
  };

  const onSvgMouseDown = (e: any) => {
    if (e.button === 0 && imgRef.current) {
      let starting_coordinate: number[] = getDefectOffset(e, imgRef.current);

      starting_coordinate = [
        Number(starting_coordinate[0] / scale),
        Number(starting_coordinate[1] / scale),
      ];

      let extra_padding = (imgRef.current.naturalWidth / 500) * 10;
      if (extra_padding < 1) {
        extra_padding = 10;
      }
      const start_x = starting_coordinate[0] - extra_padding;
      const start_y = starting_coordinate[1] - extra_padding;
      const end_x = starting_coordinate[0] + extra_padding;
      const end_y = starting_coordinate[1] + extra_padding;

      const defect = [getDefectOffset(e, imgRef.current)];
      svg.clear();
      const draw = svg.polyline(defect);
      const rectDefect = [];
      rectDefect.push(
        [start_x, start_y],
        [end_x, start_y],
        [end_x, end_y],
        [start_x, end_y],
        [start_x, start_y],
      );
      draw.plot(rectDefect);
    }
  };

  return (
    <div>
      <div id="add-defect-map">
        <TransformWrapper
          onWheelStop={(e) => {
            // setScale(e.state.scale);
          }}
        >
          <TransformComponent>
            <div style={{ width: '100%' }}>
              <div
                style={{ width: '100%', height: 'auto', position: 'relative' }}
              >
                <img
                  ref={imgRef}
                  style={{ width: '100%' }}
                  src={GG_LINK_FILE(cloudId, import.meta.env.VITE_GG_API_KEY)}
                  alt="no-img"
                  onLoad={onImageLoaded}
                />
                <svg
                  //   ref={svgRef}
                  onMouseDown={onSvgMouseDown}
                  id="svg"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                />
              </div>
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
}
