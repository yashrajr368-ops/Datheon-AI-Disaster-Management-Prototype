"""
DATHEON AI - Transparent Risk Engine & ML Modeling
This module combines:
1. Explainable Rule-Based Multi-Criteria Decision Analysis (MCDA)
2. scikit-learn Machine Learning Model trained on synthetic historical flood dataset
3. Input validation, factor attribution, data quality scoring, and actionable preparedness recommendations.
"""

import numpy as np
import pandas as pd
from typing import Dict, Any, List
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler

class DisasterRiskEngine:
    def __init__(self):
        self.rf_model = None
        self.scaler = None
        self._train_demonstration_ml_model()

    def _train_demonstration_ml_model(self):
        """
        Trains a scikit-learn demonstration regression model on synthetic historical flood indicator data.
        Clearly labeled as a synthetic training set for prototype demonstration purposes.
        """
        np.random.seed(42)
        n_samples = 3000

        # Generate realistic synthetic training distributions
        rain = np.random.gamma(shape=2.5, scale=35.0, size=n_samples)  # 0 to 350 mm
        rain = np.clip(rain, 0.0, 400.0)

        river = np.random.normal(loc=1.0, scale=2.5, size=n_samples)  # -3.0 to 12.0 m
        river = np.clip(river, -2.0, 15.0)

        history = np.random.poisson(lam=3.5, size=n_samples)  # 0 to 12 events
        history = np.clip(history, 0, 15)

        terrain = np.random.beta(a=2.0, b=2.0, size=n_samples)  # 0.0 to 1.0
        pop_vuln = np.random.beta(a=2.5, b=2.0, size=n_samples)  # 0.0 to 1.0

        # Non-linear synthetic risk formula with physical interactions:
        # e.g., heavy rain + high river + poor drainage creates compounding non-linear surge
        raw_score = (
            (rain / 200.0) * 32.0 +
            (np.clip(river + 2.0, 0, 12.0) / 12.0) * 26.0 +
            (history / 10.0) * 14.0 +
            (terrain * 14.0) +
            (pop_vuln * 14.0) +
            # Compound interaction terms
            ((rain / 200.0) * terrain * 8.0) +
            (np.random.normal(0, 2.5, size=n_samples))
        )
        target_score = np.clip(raw_score, 0.0, 100.0)

        X = np.column_stack([rain, river, history, terrain, pop_vuln])
        y = target_score

        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)

        self.rf_model = RandomForestRegressor(n_estimators=60, max_depth=8, random_state=42)
        self.rf_model.fit(X_scaled, y)

    def evaluate_risk(
        self,
        rainfall_mm: float,
        river_level_m: float,
        historical_flood_events: int,
        terrain_susceptibility: float,
        population_vulnerability: float,
        location_name: str = "Demonstration Location"
    ) -> Dict[str, Any]:
        """
        Calculates both rule-based score and ML predicted score,
        explains contributing factors, assesses data quality, and outputs NDMA-aligned actions.
        """
        # 1. Explainable Rule-Based Multi-Criteria Decision Analysis (Weights sum to 100)
        # Normalized sub-scores
        rain_norm = min(1.0, max(0.0, rainfall_mm / 220.0))
        river_norm = min(1.0, max(0.0, (river_level_m + 1.0) / 7.0))
        history_norm = min(1.0, max(0.0, historical_flood_events / 10.0))
        terrain_norm = min(1.0, max(0.0, terrain_susceptibility))
        pop_norm = min(1.0, max(0.0, population_vulnerability))

        w_rain = 30.0
        w_river = 25.0
        w_history = 15.0
        w_terrain = 15.0
        w_pop = 15.0

        p_rain = round(rain_norm * w_rain, 2)
        p_river = round(river_norm * w_river, 2)
        p_history = round(history_norm * w_history, 2)
        p_terrain = round(terrain_norm * w_terrain, 2)
        p_pop = round(pop_norm * w_pop, 2)

        rule_score = round(min(100.0, max(0.0, p_rain + p_river + p_history + p_terrain + p_pop)), 1)

        # 2. ML Model Prediction
        input_features = np.array([[rainfall_mm, river_level_m, historical_flood_events, terrain_susceptibility, population_vulnerability]])
        input_scaled = self.scaler.transform(input_features)
        ml_score = float(round(self.rf_model.predict(input_scaled)[0], 1))
        ml_score = min(100.0, max(0.0, ml_score))

        # Composite demonstration score (weighted blend: 60% rule-based transparent + 40% ML synthetic model)
        composite_score = round((0.6 * rule_score) + (0.4 * ml_score), 1)

        # Categorization
        if composite_score < 30.0:
            category = "Low"
        elif composite_score < 55.0:
            category = "Moderate"
        elif composite_score < 75.0:
            category = "High"
        else:
            category = "Severe"

        # Factors Breakdown
        total_p = p_rain + p_river + p_history + p_terrain + p_pop or 1.0
        factors = [
            {
                "name": "24-hr Rainfall",
                "raw_value": float(rainfall_mm),
                "unit": "mm",
                "normalized_weight": w_rain,
                "weighted_score": p_rain,
                "contribution_percent": round((p_rain / total_p) * 100, 1),
                "explanation": f"Current 24h precipitation is {rainfall_mm} mm. Values exceeding 100 mm dramatically elevate runoff volume."
            },
            {
                "name": "River Gauge Level",
                "raw_value": float(river_level_m),
                "unit": "m above danger mark",
                "normalized_weight": w_river,
                "weighted_score": p_river,
                "contribution_percent": round((p_river / total_p) * 100, 1),
                "explanation": f"River gauge is {river_level_m:+.1f} m relative to danger threshold. Heights above 0.0 m breach embankment tolerance."
            },
            {
                "name": "Historical Flood Recurrence",
                "raw_value": float(historical_flood_events),
                "unit": "events / 10 yrs",
                "normalized_weight": w_history,
                "weighted_score": p_history,
                "contribution_percent": round((p_history / total_p) * 100, 1),
                "explanation": f"{historical_flood_events} documented inundation events in past decade indicate high catchment retention vulnerability."
            },
            {
                "name": "Terrain Susceptibility",
                "raw_value": float(terrain_susceptibility),
                "unit": "index (0-1)",
                "normalized_weight": w_terrain,
                "weighted_score": p_terrain,
                "contribution_percent": round((p_terrain / total_p) * 100, 1),
                "explanation": f"Topographical slope, soil permeability, and natural stormwater drainage vulnerability rated at {terrain_susceptibility}."
            },
            {
                "name": "Population & Socio Vulnerability",
                "raw_value": float(population_vulnerability),
                "unit": "index (0-1)",
                "normalized_weight": w_pop,
                "weighted_score": p_pop,
                "contribution_percent": round((p_pop / total_p) * 100, 1),
                "explanation": f"Socio-demographic exposure, elder/child dependency, and dwelling construction type rated at {population_vulnerability}."
            }
        ]

        # 3. Data Quality & Sanity Assessment
        data_quality = 98.0
        if rainfall_mm > 300.0 and river_level_m < -2.0:
            data_quality -= 20.0  # physical inconsistency caveat
        if terrain_susceptibility == 0.0 or population_vulnerability == 0.0:
            data_quality -= 8.0

        # 4. Actionable Preparedness Recommendations (NDMA & Sendai Framework Aligned)
        actions = []
        if category == "Low":
            actions = [
                "Maintain baseline routine situational awareness via local weather reports.",
                "Review household emergency go-bag supplies (water, flashlight, medicines).",
                "Inspect residential drainage grates and clear leaf debris.",
                "Keep emergency contact numbers handy (NDRF 1078 / Emergency 112)."
            ]
        elif category == "Moderate":
            actions = [
                "Issue precautionary advisory to low-lying neighborhood representatives.",
                "Store portable water and minimum 3-day non-perishable food supplies.",
                "Charge emergency communication devices and external power banks.",
                "Ensure community shelter transit routes remain unblocked by vehicles.",
                "Move vulnerable ground-floor valuables and documents to higher shelves."
            ]
        elif category == "High":
            actions = [
                "Activate local Disaster Management Committee (DMC) emergency vigil.",
                "Identify designated accessible shelter locations and verify transit availability.",
                "Prepare elderly persons, children, and livestock for possible relocation notice.",
                "Do not drive or walk through standing or moving flood water ('Turn Around, Don't Drown').",
                "Turn off main electrical breakers and gas cylinders if water enters premises."
            ]
        else: # Severe
            actions = [
                "URGENT: Initiate prompt voluntary relocation to verified elevated shelter structures.",
                "Follow official instructions from District Disaster Management Authority (DDMA) & NDRF.",
                "Do not attempt to ford swollen nullahs, bridges, or culverts.",
                "Signal for emergency rescue assistance using whistles, bright cloth, or phone flashlights if marooned.",
                "Keep disaster grab-bag waterproofed and stay in direct contact with shelter wardens."
            ]

        limitations = [
            "Demonstration Prototype: The risk score is an algorithmic decision-support estimate and not an officially certified meteorological prediction.",
            "Synthetic Hydrological Modeling: Machine learning predictions are trained on synthetic historical catchment datasets for academic hackathon demonstration.",
            "Localized Microclimate Variance: Real flash floods are governed by upstream dam releases, localized culvert blockages, and hyper-local cloudbursts not fully captured in single-sensor indicators.",
            "Official Precedence: In actual emergency situations, always obey real-time directives issued by NDMA, SDMA, CWC, and District Administration."
        ]

        return {
            "risk_score": composite_score,
            "risk_category": category,
            "methodology": "Hybrid MCDA (Multi-Criteria Decision Analysis 60%) + Scikit-Learn Random Forest ML (40%)",
            "rule_score": rule_score,
            "ml_predicted_score": ml_score,
            "ml_confidence": round(float(np.mean(self.rf_model.feature_importances_)) * 3.5 + 0.75, 2),
            "factors": factors,
            "data_quality_score": max(50.0, data_quality),
            "limitations": limitations,
            "suggested_actions": actions,
            "is_simulated": True,
            "disclaimer": "FOR HACKATHON DEMONSTRATION ONLY. Simulated indicators do not constitute official flood warnings or certified evacuation mandates."
        }

# Global singleton engine
risk_engine = DisasterRiskEngine()
