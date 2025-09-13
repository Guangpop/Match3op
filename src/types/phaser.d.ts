/**
 * Phaser.js Type Declarations for Browser Environment
 * Since Phaser is loaded from CDN, we need to declare it as a global
 */

declare global {
  namespace Phaser {
    const AUTO: number;
    const WEBGL: number;
    const CANVAS: number;
    
    class Game {
      constructor(config: any);
      scene: any;
      events: any;
      destroy(removeCanvas?: boolean): void;
    }
    
    class Scene {
      constructor(config?: any);
      scene: any;
      game: any;
      add: any;
      input: any;
      tweens: any;
      time: any;
      events: any;
      load: any;
      cameras: any;
      children: any;
    }
    
    namespace GameObjects {
      class Sprite {
        constructor(scene: any, x: number, y: number, texture: string);
        x: number;
        y: number;
        setInteractive(): this;
        on(event: string, callback: Function): this;
        setTint(color: number): this;
        clearTint(): this;
        setScale(scale: number): this;
        setAlpha(alpha: number): this;
        setY(y: number): this;
        getData(key: string): any;
        setData(key: string, value: any): this;
        destroy(): void;
      }
      
      class Graphics {
        constructor(scene: any);
        fillStyle(color: number, alpha?: number): this;
        fillRect(x: number, y: number, width: number, height: number): this;
        fillRoundedRect(x: number, y: number, width: number, height: number, radius: number): this;
        lineStyle(lineWidth: number, color: number, alpha?: number): this;
        strokeRect(x: number, y: number, width: number, height: number): this;
        lineBetween(x1: number, y1: number, x2: number, y2: number): this;
      }
      
      class Text {
        constructor(scene: any, x: number, y: number, text: string, style?: any);
        setText(text: string): this;
        setStyle(style: any): this;
      }
      
      namespace Particles {
        class ParticleEmitter {
          constructor(scene: any, x: number, y: number, texture: string, config?: any);
          start(): this;
          stop(): this;
          destroy(): void;
        }
      }
    }
    
    namespace Input {
      interface Pointer {
        x: number;
        y: number;
      }
    }
    
    namespace Types {
      namespace Core {
        interface GameConfig {
          type?: number;
          width?: number;
          height?: number;
          parent?: string;
          backgroundColor?: string;
          scene?: any;
          physics?: any;
          render?: any;
          scale?: any;
          input?: any;
          dom?: any;
        }
      }
    }
    
    namespace Scale {
      const FIT: number;
      const CENTER_BOTH: number;
    }
    
    namespace Tweens {
      class Timeline {
        constructor(scene: any, config?: any);
        add(config: any): this;
        play(): this;
      }
    }
    
    namespace Events {
      class EventEmitter {
        constructor();
        on(event: string, callback: Function): this;
        once(event: string, callback: Function): this;
        emit(event: string, ...args: any[]): boolean;
      }
    }
  }
}

export {};
