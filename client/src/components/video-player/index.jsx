import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { Fullscreen, Maximize, Minimize, Pause, Play, RotateCcw, RotateCw, Volume2, VolumeX } from 'lucide-react';

const VideoPlayer = ({ url, onProgressUpdate, progressData }) => {
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [muted, setMuted] = useState(false);
    const [played, setPlayed] = useState(0); // current played time
    const [seeking, setSeeking] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [dimensions, setDimensions] = useState({ width: '100%', height: '200px' });

    const playerRef = useRef(null);
    const playerContainerRef = useRef(null);
    const controlsTimeoutRef = useRef(null);

    // Toggle play/pause state
    const handlePlayAndPause = () => setPlaying(!playing);

    // Update progress as video plays
    const handleProgress = (state) => {
        if (!seeking) setPlayed(state.played);
    };

    // Rewind 5 seconds
    const handleRewind = () => {
        playerRef?.current.seekTo(playerRef?.current?.getCurrentTime() - 5);
    };

    // Forward 5 seconds
    const handleForward = () => {
        playerRef?.current.seekTo(playerRef?.current?.getCurrentTime() + 5);
    };

    // Toggle mute
    const handleToggleMute = () => setMuted(!muted);

    // Update played time when seeking
    const handleSeekChange = (newValue) => {
        setPlayed(newValue[0]);
        setSeeking(true);
    };

    // Seek to new position on mouse release
    const handleSeekMouseUp = () => {
        setSeeking(false);
        playerRef?.current?.seekTo(played);
    };

    // Update volume
    const handleVolumeChange = (newValue) => setVolume(newValue[0]);

    // Format time for display
    const formatTime = (seconds) => {
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = ("0" + date.getUTCMinutes()).slice(-2);
        const ss = ("0" + date.getUTCSeconds()).slice(-2);
        return hh ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
    };

    // Toggle full-screen mode
    const handleFullScreen = useCallback(() => {
        if (!isFullScreen) {
            playerContainerRef?.current?.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    }, [isFullScreen]);

    // Show controls on mouse movement
    const handleMouseMove = () => {
        setShowControls(true);
        clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };

    // set dimension for video player
    useEffect(() => {
        const updateDimensions = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setDimensions({ width: '100%', height: '200px' });
            } else if (width < 768) {
                setDimensions({ width: '100%', height: '300px' });
            } else if (width < 1024) {
                setDimensions({ width: '100%', height: '400px' });
            } else {
                setDimensions({ width: '100%', height: '400px' });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Detect full-screen changes
    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullScreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
    }, []);

    // handle progress upadtes
    useEffect(() => {
        if (played === 1) {
            onProgressUpdate({
                ...progressData,
                progressValue: played
            })
        }
    }, [played]);

    // Reset play button when video ends
    const handleVideoEnd = () => setPlaying(false);

    return (
        <div
            ref={playerContainerRef}
            className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl transition-all 
                duration-300 ease-in-out ${isFullScreen ? 'w-screen h-screen' : 'w-full'} 
                sm:w-[320px] md:w-[480px] lg:w-[720px] xl:w-[1080px] h-52`}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setShowControls(false)}
            style={dimensions}
        >
            <ReactPlayer
                ref={playerRef}
                className="absolute top-0 left-0"
                width="100%"
                height="100%"
                url={url}
                playing={playing}
                volume={volume}
                muted={muted}
                onProgress={handleProgress}
                onEnded={handleVideoEnd} // Reset play button on end
            />

            {showControls && (
                <div
                    className={`absolute bottom-0 left-0 right-0 
                        bg-gray-800 bg-opacity-75 p-3 flex flex-col space-y-2 transition-opacity duration-300 
                        ${showControls ? 'opacity-100' : 'opacity-0'}`}
                >
                    <Slider
                        value={[played * 100]}
                        max={100}
                        step={0.1}
                        onValueChange={(value) => handleSeekChange([value[0] / 100])}
                        onValueCommit={handleSeekMouseUp}
                        className="w-full"
                    />

                    <div className="flex items-center justify-between overflow-x-scroll lg:overflow-hidden">
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handlePlayAndPause}
                                className="text-white hover:text-primary hover:bg-gray-700"
                            >
                                {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleRewind}
                                className="text-white hover:text-primary hover:bg-gray-700"
                            >
                                <RotateCcw className="h-6 w-6" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleForward}
                                className="text-white hover:text-primary hover:bg-gray-700"
                            >
                                <RotateCw className="h-6 w-6" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleToggleMute}
                                className="text-white hover:text-primary hover:bg-gray-700"
                            >
                                {muted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                            </Button>

                            <Slider
                                value={[volume * 100]}
                                max={100}
                                step={1}
                                onValueChange={(value) => handleVolumeChange([value[0] / 100])}
                                className="w-24"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="text-white">
                                {formatTime(played * (playerRef.current?.getDuration() || 0))} /{' '}
                                {formatTime(playerRef.current?.getDuration() || 0)}
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleFullScreen}
                                className="text-white hover:text-primary hover:bg-gray-700"
                            >
                                {isFullScreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;