export default function DroneGraphic() {
    return (
        <svg
            viewBox="0 0 600 500"
            className="w-[520px] h-auto"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Radar circles */}
            <circle
                cx="300"
                cy="250"
                r="65"
                stroke="#F5A623"
                strokeOpacity="0.20"
            />

            <circle
                cx="300"
                cy="250"
                r="130"
                stroke="#F5A623"
                strokeOpacity="0.16"
            />

            <circle
                cx="300"
                cy="250"
                r="205"
                stroke="#F5A623"
                strokeOpacity="0.12"
            />

            {/* Drone arms */}
            <path
                d="M270 230 L150 130"
                stroke="#F5A623"
                strokeWidth="5"
            />

            <path
                d="M330 230 L450 130"
                stroke="#F5A623"
                strokeWidth="5"
            />

            <path
                d="M270 270 L150 370"
                stroke="#F5A623"
                strokeWidth="5"
            />

            <path
                d="M330 270 L450 370"
                stroke="#F5A623"
                strokeWidth="5"
            />

            {/* Top Left Motor */}
            <ellipse
                cx="150"
                cy="130"
                rx="38"
                ry="10"
                fill="#9B741E"
                opacity="0.7"
            />

            <ellipse
                cx="150"
                cy="130"
                rx="10"
                ry="38"
                fill="#9B741E"
                opacity="0.5"
            />

            <circle
                cx="150"
                cy="130"
                r="15"
                fill="#063B2D"
                stroke="#F5A623"
                strokeWidth="3"
            />

            <circle
                cx="150"
                cy="130"
                r="5"
                fill="#45D483"
            />

            {/* Top Right Motor */}
            <ellipse
                cx="450"
                cy="130"
                rx="38"
                ry="10"
                fill="#9B741E"
                opacity="0.7"
            />

            <ellipse
                cx="450"
                cy="130"
                rx="10"
                ry="38"
                fill="#9B741E"
                opacity="0.5"
            />

            <circle
                cx="450"
                cy="130"
                r="15"
                fill="#063B2D"
                stroke="#F5A623"
                strokeWidth="3"
            />

            <circle
                cx="450"
                cy="130"
                r="5"
                fill="#45D483"
            />

            {/* Bottom Left Motor */}
            <ellipse
                cx="150"
                cy="370"
                rx="38"
                ry="10"
                fill="#9B741E"
                opacity="0.7"
            />

            <ellipse
                cx="150"
                cy="370"
                rx="10"
                ry="38"
                fill="#9B741E"
                opacity="0.5"
            />

            <circle
                cx="150"
                cy="370"
                r="15"
                fill="#063B2D"
                stroke="#F5A623"
                strokeWidth="3"
            />

            <circle
                cx="150"
                cy="370"
                r="5"
                fill="#FF6B6B"
            />

            {/* Bottom Right Motor */}
            <ellipse
                cx="450"
                cy="370"
                rx="38"
                ry="10"
                fill="#9B741E"
                opacity="0.7"
            />

            <ellipse
                cx="450"
                cy="370"
                rx="10"
                ry="38"
                fill="#9B741E"
                opacity="0.5"
            />

            <circle
                cx="450"
                cy="370"
                r="15"
                fill="#063B2D"
                stroke="#F5A623"
                strokeWidth="3"
            />

            <circle
                cx="450"
                cy="370"
                r="5"
                fill="#FF6B6B"
            />

            {/* Drone Body */}
            <rect
                x="260"
                y="220"
                width="80"
                height="60"
                rx="12"
                fill="#F5A623"
            />

            {/* Body screen */}
            <rect
                x="275"
                y="235"
                width="50"
                height="28"
                rx="5"
                fill="#675B25"
            />

            {/* Bottom camera */}
            <circle
                cx="300"
                cy="300"
                r="14"
                fill="#063B2D"
                stroke="#F5A623"
                strokeWidth="3"
            />

            <circle
                cx="300"
                cy="300"
                r="5"
                fill="#45D483"
            />

            {/* Signal */}
            <path
                d="M288 208 Q300 190 312 208"
                stroke="#F5A623"
                strokeWidth="3"
                strokeLinecap="round"
            />

            <path
                d="M280 195 Q300 165 320 195"
                stroke="#F5A623"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.5"
            />
        </svg>
    );
}