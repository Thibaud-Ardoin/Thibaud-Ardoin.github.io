### Paper abstract

Recent work has demonstrated that autonomous vehicles (AVs) can be used to
smooth emergent traffic shock-waves and improve the resultant energy efficiency
of traffic. Building the controllers for these vehicles usually involves building a
simulator as an intermediate step; this involves careful estimation of human driving
dynamics and network calibration which can be challenging at scale. We investigate
whether it is possible to learn optimal traffic controllers by using the abundance of
available human driving data. We use Offline Reinforcement Learning to extract
controllers from "human" driving data collected from simulator runs. In contrast to
expectations that data from an expert or random policy is needed, we demonstrate
that assuming slightly noisy models of human driving is sufficient to generate data
that covers the state space enough to extract effective controllers. We compare
with a hand-designed linear controller and show that our controller significantly
outperforms it. This suggests the possibility of directly extracting traffic smoothing
policies from abundant driver data collected from deployed AVs.
